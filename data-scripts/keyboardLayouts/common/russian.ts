export default {
  slanted: true,
  // Base ru(common) layout from xkeyboard-config symbols/ru.
  // Do not mix in ru(winkeys), typewriter, or phonetic variants.
  layout: `
ёЁ 1! 2" 3# 4* 5: 6, 7. 8; 9( 0) -_ =+
    йЙ цЦ уУ кК еЕ нН гГ шШ щЩ зЗ хХ ъЪ \\|
     фФ ыЫ вВ аА пП рР оО лЛ дД жЖ эЭ
      яЯ чЧ сС мМ иИ тТ ьЬ бБ юЮ /?
  `,
  shiftedRx: /[Ё!"#*:,.;()_+ЙЦУКЕНГШЩЗХЪ|ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ?]/,
}
