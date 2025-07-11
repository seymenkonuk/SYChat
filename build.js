const fs = require('fs');
const path = require('path');
const Terser = require('terser');
const CleanCSS = require('clean-css');

// Göreceli Konumlar
const srcDir = 'src';
const buildDir = 'build';

// Mutlak Konumlar
const srcPath = path.join(__dirname, srcDir)
const buildPath = path.join(__dirname, buildDir)

// Build Klasörü Zaten Varsa Sil
if (fs.existsSync(buildPath)) {
	fs.rmSync(buildPath, { recursive: true, force: true });
}

// Build Klasörünü Oluştur
fs.mkdirSync(buildPath);

// İçindeki Dosyaları Oluştur
const minify = (dir) => {
	// SRC ve BUİLD Dizinindeki Mutlak Konumları Hesapla
	const currentSrcPath = path.join(srcPath, dir);
	const currentBuildPath = path.join(buildPath, dir);
	// O Konumdaki Dosya ve Dizinleri Al
	const files = fs.readdirSync(currentSrcPath);

	// Teker Teker, Dosya ve Dizinler Arasında Dolaş
	files.forEach(async (file) => {
		// Dosya veya Dizinin Mutlak Konumunu Al
		const srcFilePath = path.join(currentSrcPath, file);
		const buildFilePath = path.join(currentBuildPath, file);
		// Dosya veya Dizinin Stat Bilgilerini Al
		const stat = fs.statSync(srcFilePath);

		// Dizin / Klasör İse
		if (stat && stat.isDirectory()) {
			fs.mkdirSync(buildFilePath);
			// dizinin içine gir
			minify(path.join(dir, file));
		}
		// JS Dosyası İse
		else if (file.endsWith(".min.js")) {
			const code = fs.readFileSync(srcFilePath, 'utf8');
			const data = await Terser.minify(code);
			fs.writeFileSync(buildFilePath, data.code, 'utf8');
		}
		// CSS Dosyası İse
		else if (file.endsWith(".min.css")) {
			const code = fs.readFileSync(srcFilePath, 'utf8');
			const data = new CleanCSS().minify(code);
			fs.writeFileSync(buildFilePath, data.styles, 'utf8');
		}
		// Diğer Tüm Dosyalar için
		else {
			fs.copyFileSync(srcFilePath, buildFilePath);
		}

	});
}

minify('.');