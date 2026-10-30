# АКЦ — самостійна модель Blender

## Стан: підготовка, 2026-10-27

Blender не знайдений у PATH, /Applications, ~/Applications та через Spotlight.
Потрібно встановити Blender для macOS або вказати шлях до Blender.app.
Модель, GLB та контрольні рендери ще не створені. Сайт не змінено.

## Джерела форми

- ../../../public/akc-logo.png — 1270 × 1239, без alpha.
- ../../../public/akc-logo-transparent.png — 1270 × 1239, з alpha.
- ../../../public/akc-brand-white.png — 57 × 56, з alpha.
- Референс: /Users/macbook/Desktop/акц.pdf/Знімок екрана 2026-09-08 о 15.32.10.png.

Знак має зовнішній трикутний силует і три внутрішні трикутні елементи,
пов'язані переплетеними деталями, а не незалежними концентричними рамками.
Центральна перевернута область PNG пов'язана з конструкцією; не додавати
довільний окремий перевернутий трикутник. Полотно PNG включає поля й
перспективу: його розміри не дорівнюють пропорціям фронтального контуру.
Товщина, з'єднання й зворотний бік ще потребують геометричної перевірки.

## Очікувані файли — поки відсутні

- akc-logo.blend
- akc-logo.glb
- hero-preview.png
- angle-preview.png
- expertise-preview.png

Майбутні матеріали: Principled BSDF, cobalt anodized metal, окремі поліровані
фаски й темні заглиблення. Для GLB запекти процедурну мікрофактуру в normal
і roughness; перевірити матеріали повторним імпортом. Студійне світло Blender
не переноситься ідентично: Three.js потребуватиме окремого environment та світла.
Інтегрувати лише після підтвердження користувачем контрольних Cycles-рендерів.

## Резервна копія

HEAD: 1859fc42c0c06f73e0eae59c2a24f4e27ecadc6d.
Каталог: /private/tmp/akc-blender-preflight-4wBFaJ/.
worktree.tar.gz включає локальні й untracked-файли, крім .git, node_modules,
.next; tracked.patch та staged.patch зберігають Git-різниці.
Commit, push, merge та deployment не виконувалися.
