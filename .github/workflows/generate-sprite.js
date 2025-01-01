const fs = require('fs').promises;
const path = require('path');
const Spritesmith = require('spritesmith');
const sharp = require('sharp');
const toPng = require('ico-to-png');

const imagesDir = path.join(__dirname, '../../img/web');
const outputDir = path.join(__dirname, '../../img');
const navtableJsPath = path.join(__dirname, '../../js/navtable.js');

// 将非 PNG 图片转换为 PNG，并调整大小为 16px x 16px
async function processImages(images) {
  const processedImages = await Promise.all(images.map(async (image) => {
    const imagePath = path.join(imagesDir, image);
    const ext = path.extname(image).toLowerCase();
    const baseName = path.basename(image, ext);
    let processedImagePath = imagePath;

    // 如果文件不是 PNG 格式，转换为 PNG
    if (ext !== '.png') {
      const convertedImagePath = path.join(imagesDir, `${baseName}.png`);
      try {
        console.log(`Converting ${imagePath} to ${convertedImagePath}`);
        // 使用 ico-to-png 处理 .ico 文件
        if (ext === '.ico') {
          const buffer = await fs.readFile(imagePath);
          const pngBuffer = await toPng(buffer, 16); // 转换为 PNG
          await fs.writeFile(convertedImagePath, pngBuffer);
        } else {
          await sharp(imagePath).toFormat('png').toFile(convertedImagePath);
        }
        await fs.unlink(imagePath); // 删除源文件
        processedImagePath = convertedImagePath;
      } catch (err) {
        console.error(`Error converting ${imagePath} to PNG:`, err);
        return null; // 如果转换失败，则返回 null
      }
    }

    // 调整图像大小并覆盖源文件
    try {
      const tempFile = `${processedImagePath}.temp.png`;
      await sharp(processedImagePath).resize(16, 16).toFile(tempFile);
      await fs.rename(tempFile, processedImagePath); // 重命名临时文件为原始文件
    } catch (err) {
      console.error(`Error resizing ${processedImagePath}:`, err);
      return null; // 如果调整大小失败，则返回 null
    }
    return processedImagePath;
  }));

  // 过滤掉任何转换或调整大小失败的图像
  return processedImages.filter(Boolean);
}

async function generateSpriteAndNavtable() {
  try {
    const navtableJson = require(navtableJsPath).navtableData;
    if (!navtableJson || !Array.isArray(navtableJson)) {
      throw new Error("navtable.js 文件中未找到有效的 navtableData 数组。");
    }
    const imageNames = [];
    const originalImagePaths = [];

    for (const category of navtableJson) {
      for (const site of category.sites) {
        if (site.icon && site.icon.startsWith('img/web/')) {
          const imagePath = path.join(imagesDir, path.basename(site.icon));
          console.log(`Checking file: ${imagePath}`);  // 添加调试信息
          try {
            await fs.access(imagePath, fs.constants.F_OK);
            imageNames.push(path.basename(site.icon));
            originalImagePaths.push(site.icon);
          } catch (err) {
            console.warn(`图标文件不存在: ${imagePath}，已跳过。`);
          }
        }
      }
    }

    if (imageNames.length === 0) {
      console.log('没有需要处理的图标。');
      return;
    }

    const processedImages = await processImages(imageNames);

    if (processedImages.length === 0) {
      console.log('没有有效的图像被处理。');
      return;
    }

    const result = await new Promise((resolve, reject) => {
      Spritesmith.run({ src: processedImages }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    await fs.writeFile(path.join(outputDir, 'sprite.png'), result.image);

const coordinatesMap = new Map();
for (const key in result.coordinates) {
    coordinatesMap.set(key, result.coordinates[key]);
}

console.log("coordinatesMap 的内容：", coordinatesMap);

for (const category of navtableJson) {
    for (const site of category.sites) {
        if (site.icon && site.icon.startsWith('img/web/')) {
            const baseName = path.basename(site.icon, path.extname(site.icon));
            const convertedImagePath = path.join(imagesDir, `${baseName}.png`);
            console.log(`正在处理的图标: ${site.icon}, baseName: ${baseName}`);
            console.log(`coordinatesMap 中是否存在 ${convertedImagePath}：`, coordinatesMap.has(`${convertedImagePath}`));
            if (coordinatesMap.has(`${convertedImagePath}`)) {
                const coordinates = coordinatesMap.get(convertedImagePath);
                site.iconX = coordinates.x
                site.iconY = coordinates.y
                site.icon = `img/web/${baseName}.png`;
                console.log(`更新后的 site.icon: ${site.icon}`);
            } else {
                console.warn(`未找到 ${convertedImagePath} 的坐标信息`);
            }
        }
    }
}

    const navtableJsContent = `var navtableData = ${JSON.stringify(navtableJson, null, 2)};\nmodule.exports = { navtableData };`;
    await fs.writeFile(navtableJsPath, navtableJsContent);

    console.log('navtable.json 文件已更新。');

    // 清理临时文件 (重要!)
    /* await Promise.all(processedImages.map(async (tmpPath) => {
      try {
        await fs.unlink(tmpPath);
      } catch (unlinkError) {
        console.warn(`清理临时文件 ${tmpPath} 失败:`, unlinkError);
      }
    })); */

  } catch (error) {
    console.error('在 generateSpriteAndNavtable 中发生错误:', error);
  }
}

generateSpriteAndNavtable();