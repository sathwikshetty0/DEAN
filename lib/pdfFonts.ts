import { Font } from '@react-pdf/renderer';

// Register Noto Sans Kannada with all needed variants
// Using the italic fallback to the regular font to prevent crashes
Font.register({
  family: 'Noto Sans Kannada',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/unhinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/unhinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/unhinted/ttf/NotoSansKannada/NotoSansKannada-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/unhinted/ttf/NotoSansKannada/NotoSansKannada-Bold.ttf', fontWeight: 700, fontStyle: 'italic' },
  ]
});

// Disable hyphenation to prevent layout issues with Kannada text
Font.registerHyphenationCallback(word => [word]);
