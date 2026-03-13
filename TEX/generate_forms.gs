/**
 * Google Apps Script — автогенерація Google Forms
 * 18 варіацій для вихователів + 27 варіацій для батьків = 45 форм
 *
 * Інструкція:
 *   1. Відкрийте https://script.google.com і створіть новий проект
 *   2. Вставте цей код
 *   3. Запустіть функцію main()
 *   4. Надайте дозвіл на створення форм
 *   5. Усі форми з'являться у вашому Google Drive (папка «Анкети_курсова»)
 */

// ── Посилання на матеріали ────────────────────────────────────────────────────
var BASE = 'https://dmitthedazed.github.io/BPEDK_coursework/m/';

var T_LINKS = {
  1: BASE + 'spb/', 2: BASE + 'dub/', 3: BASE + 'ksh/',
  4: BASE + 'xhf/', 5: BASE + 'bbp/', 6: BASE + 'izh/',
  7: BASE + 'lsk/', 8: BASE + 'snc/', 9: BASE + 'pst/'
};

var V_LINKS = {
  1: BASE + 'grk/', 2: BASE + 'pkd/', 3: BASE + 'ssn/',
  4: BASE + 'trk/', 5: BASE + 'tfi/', 6: BASE + 'prs/'
};

// ── Комбінації TxV ────────────────────────────────────────────────────────────
// 18 для вихователів (кожен T — 2 рази, кожен V — 3 рази)
var EDU_COMBOS = [
  [8,5],[8,3],[9,6],[6,6],[7,4],[4,6],
  [9,3],[2,3],[7,2],[4,4],[1,2],[1,4],
  [6,5],[2,1],[5,5],[5,1],[3,2],[3,1]
];

// 27 для батьків (кожен T — 3 рази, кожен V — 4–5 разів)
var PAR_COMBOS = [
  [2,2],[9,4],[7,5],[6,2],[4,6],[1,5],
  [8,6],[9,3],[7,4],[6,6],[2,5],[2,3],
  [4,2],[8,3],[4,5],[6,5],[3,2],[8,2],
  [5,3],[9,6],[3,3],[5,1],[3,1],[1,4],
  [7,1],[1,1],[5,6]
];

// ── Шкала 1–5 ─────────────────────────────────────────────────────────────────
var SCALE_5 = ['1', '2', '3', '4', '5'];

// ═══════════════════════════════════════════════════════════════════════════════
// ГОЛОВНА ФУНКЦІЯ
// ═══════════════════════════════════════════════════════════════════════════════
function main() {
  var folder = getOrCreateFolder_('Анкети_курсова');

  Logger.log('═══ Генерація форм для ВИХОВАТЕЛІВ (18) ═══');
  for (var i = 0; i < EDU_COMBOS.length; i++) {
    var t = EDU_COMBOS[i][0], v = EDU_COMBOS[i][1];
    var idx = String(i + 1);
    while (idx.length < 2) idx = '0' + idx;
    var id = 'В-' + idx + '-T' + t + 'V' + v;
    createEducatorForm_(folder, id, t, v);
    Logger.log('  ✓ ' + id);
  }

  Logger.log('═══ Генерація форм для БАТЬКІВ (27) ═══');
  for (var i = 0; i < PAR_COMBOS.length; i++) {
    var t = PAR_COMBOS[i][0], v = PAR_COMBOS[i][1];
    var idx = String(i + 1);
    while (idx.length < 2) idx = '0' + idx;
    var id = 'Б-' + idx + '-T' + t + 'V' + v;
    createParentForm_(folder, id, t, v);
    Logger.log('  ✓ ' + id);
  }

  Logger.log('═══ Готово! 45 форм створено у папці «Анкети_курсова» ═══');
}

// ═══════════════════════════════════════════════════════════════════════════════
// ФОРМА ДЛЯ ВИХОВАТЕЛІВ
// ═══════════════════════════════════════════════════════════════════════════════
function createEducatorForm_(folder, id, t, v) {
  var form = FormApp.create('Анкета ' + id);
  form.setDescription(
    'Дослідження «Психологічна безпека та педагогічна доцільність ' +
    'ШІ-генерованого контенту для дошкільників»\n\n' +
    'Конфіденційно. Персональні дані не збираються.\n' +
    'Заповнення займає близько 7–10 хвилин.\n\n' +
    'ID анкети: ' + id
  );
  form.setIsQuiz(false);
  form.setCollectEmail(false);

  // ── Блок А. Загальні відомості ──────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок А. Загальні відомості');

  form.addTextItem()
    .setTitle('1. Стаж (років)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('1. Група')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('2. Освіта')
    .setChoiceValues(['Вища (дошкільна освіта)', 'Вища (інша)', 'Середня спеціальна'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3. Чи використовуєте відео / аудіоказки у роботі з дітьми?')
    .setChoiceValues(['Так, регулярно', 'Іноді', 'Рідко', 'Ні'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('4. Якщо так — як часто?')
    .setChoiceValues(['Щодня', 'Кілька разів на тиждень', 'Рідше'])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('5. З якою метою найчастіше? (можна кілька)')
    .setChoiceValues([
      'Тематичне заняття', 'Ранкове коло',
      'Відпочинок / пауза', 'Розвиток мовлення',
      'Обговорення емоцій', 'Інше'
    ])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('6. З якого джерела найчастіше берете матеріали?')
    .setChoiceValues([
      'YouTube', 'YouTube Kids', 'Файли / флешка',
      'Освітні платформи', 'Телебачення', 'Інше'
    ])
    .setRequired(false);

  // ── Блок Б. Ставлення до контенту ───────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок Б. Ставлення до контенту');

  form.addScaleItem()
    .setTitle('7. Важливість перевірки контенту перед показом')
    .setLabels('зовсім не важливо', 'дуже важливо')
    .setBounds(1, 5)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('8. Ключові ознаки якісного контенту (можна кілька)')
    .setChoiceValues([
      'Чіткий сюжет', 'Позитивні цінності', 'Спокійний темп',
      'Природне мовлення', 'Без насилля / переляку',
      'Відповідність віку', 'Інше'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('9. Чи знаєте, що таке «ШІ-контент»?')
    .setChoiceValues(['Так', 'Чув(-ла), не впевнений(-а)', 'Ні'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('10. Чи використовували ШІ-контент у роботі?')
    .setChoiceValues(['Так, свідомо', 'Можливо', 'Ні'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('11. Чи може ШІ-контент бути педагогічно доцільним?')
    .setChoiceValues(['Так', 'Скоріше так', 'Скоріше ні', 'Ні', 'Важко відповісти'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('12. Рівень довіри до дитячих YouTube-каналів')
    .setLabels('дуже низький', 'дуже високий')
    .setBounds(1, 5)
    .setRequired(true);

  // ── Блок В. Сліпе оцінювання ────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок В. Сліпе оцінювання двох зразків')
    .setHelpText('Оцініть два матеріали за посиланнями нижче.');

  // Зразок 1 (текст)
  form.addSectionHeaderItem()
    .setTitle('Зразок 1 (текст)')
    .setHelpText('Перейдіть за посиланням і ознайомтесь із матеріалом:\n' + T_LINKS[t]);

  addRatingGrid_(form, 'Зразок 1', [
    'Чіткий сюжет', 'Ціннісний зміст', 'Якість мовлення',
    'Психологічна безпека', 'Вікова доречність', 'Загальна доцільність'
  ]);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 1 — Походження')
    .setChoiceValues(['Традиційний', 'ШІ', 'Важко сказати'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 1 — Використали б у роботі?')
    .setChoiceValues(['Так', 'Скоріше так', 'Скоріше ні', 'Ні'])
    .setRequired(true);

  // Зразок 2 (відео)
  form.addSectionHeaderItem()
    .setTitle('Зразок 2 (відео)')
    .setHelpText('Перейдіть за посиланням і ознайомтесь із матеріалом:\n' + V_LINKS[v]);

  addRatingGrid_(form, 'Зразок 2', [
    'Чіткий сюжет', 'Ціннісний зміст', 'Якість мовлення',
    'Психологічна безпека', 'Вікова доречність', 'Загальна доцільність'
  ]);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 2 — Походження')
    .setChoiceValues(['Традиційний', 'ШІ', 'Важко сказати'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 2 — Використали б у роботі?')
    .setChoiceValues(['Так', 'Скоріше так', 'Скоріше ні', 'Ні'])
    .setRequired(true);

  // ── Блок Г. Відкриті відповіді ──────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок Г. Відкриті відповіді');

  form.addParagraphTextItem()
    .setTitle('13. Який найбільший ризик ШІ-контенту для психологічного розвитку дошкільника?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('14. Які ознаки дозволяють швидко розпізнати якісний матеріал для дітей?')
    .setRequired(false);

  // Move to folder
  moveFileToFolder_(form.getId(), folder);
  return form;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ФОРМА ДЛЯ БАТЬКІВ
// ═══════════════════════════════════════════════════════════════════════════════
function createParentForm_(folder, id, t, v) {
  var form = FormApp.create('Анкета ' + id);
  form.setDescription(
    'Дослідження «Психологічна безпека та педагогічна доцільність ' +
    'ШІ-генерованого контенту для дошкільників»\n\n' +
    'Конфіденційно. Персональні дані не збираються.\n' +
    'Заповнення займає близько 7–10 хвилин.\n\n' +
    'ID анкети: ' + id
  );
  form.setIsQuiz(false);
  form.setCollectEmail(false);

  // ── Блок А. Загальні відомості ──────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок А. Загальні відомості');

  form.addTextItem()
    .setTitle('1. Вік дитини (років)')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('1. Стать дитини')
    .setChoiceValues(['Хлопчик', 'Дівчинка'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. Кількість дітей дошкільного віку в родині')
    .setChoiceValues(['1', '2', '3 і більше'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3. Скільки часу на добу дитина дивиться відео / мультфільми (будні)?')
    .setChoiceValues(['До 30 хв.', '30–60 хв.', '1–2 год.', 'Більше 2 год.'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('4. На якому пристрої найчастіше?')
    .setChoiceValues(['Телевізор', 'Планшет', 'Смартфон', 'ПК / ноутбук'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5. Хто обирає контент для дитини?')
    .setChoiceValues(['Я сам/-а', 'Дитина', 'Разом', 'Старші діти'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. Чи дивитеся разом із дитиною?')
    .setChoiceValues(['Завжди', 'Часто', 'Іноді', 'Рідко', 'Ніколи'])
    .setRequired(true);

  // ── Блок Б. Ставлення до контенту ───────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок Б. Ставлення до контенту');

  form.addMultipleChoiceItem()
    .setTitle('7. Чи перевіряєте контент перед показом дитині?')
    .setChoiceValues(['Завжди', 'Часто', 'Іноді', 'Рідко', 'Ніколи'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('8. Що найважливіше при виборі контенту? (можна кілька)')
    .setChoiceValues([
      'Позитивні цінності', 'Без насилля', 'Спокійний темп',
      'Хороша мова', 'Дитині подобається', 'Знайома студія', 'Інше'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('9. Занепокоєність якістю контенту, який дивиться дитина')
    .setLabels('зовсім не турбує', 'турбує дуже')
    .setBounds(1, 5)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('10. Чи знаєте, що таке «ШІ-контент»?')
    .setChoiceValues(['Так', 'Чув(-ла), не впевнений(-а)', 'Ні'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('11. Чи давали дитині ШІ-контент?')
    .setChoiceValues(['Так, свідомо', 'Можливо', 'Ні'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('12. Чи помічали негативну реакцію дитини на контент?')
    .setChoiceValues(['Так, неодноразово', 'Так, один раз', 'Ні'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('13. Рівень довіри до YouTube-каналів для дітей')
    .setLabels('дуже низький', 'дуже високий')
    .setBounds(1, 5)
    .setRequired(true);

  // ── Блок В. Сліпе оцінювання ────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок В. Сліпе оцінювання двох зразків')
    .setHelpText('Оцініть два матеріали за посиланнями нижче.');

  // Зразок 1 (текст)
  form.addSectionHeaderItem()
    .setTitle('Зразок 1 (текст)')
    .setHelpText('Перейдіть за посиланням і ознайомтесь із матеріалом:\n' + T_LINKS[t]);

  addRatingGrid_(form, 'Зразок 1', [
    'Сподобається дитині?', 'Позитивний приклад / цінність',
    'Безпечний для дитини?', 'Якість мови',
    'Відповідність вікові', 'Загальна оцінка'
  ]);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 1 — Походження')
    .setChoiceValues(['Традиційний', 'ШІ', 'Важко сказати'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 1 — Показали б дитині?')
    .setChoiceValues(['Так', 'Скоріше так', 'Скоріше ні', 'Ні'])
    .setRequired(true);

  // Зразок 2 (відео)
  form.addSectionHeaderItem()
    .setTitle('Зразок 2 (відео)')
    .setHelpText('Перейдіть за посиланням і ознайомтесь із матеріалом:\n' + V_LINKS[v]);

  addRatingGrid_(form, 'Зразок 2', [
    'Сподобається дитині?', 'Позитивний приклад / цінність',
    'Безпечний для дитини?', 'Якість мови',
    'Відповідність вікові', 'Загальна оцінка'
  ]);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 2 — Походження')
    .setChoiceValues(['Традиційний', 'ШІ', 'Важко сказати'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Зразок 2 — Показали б дитині?')
    .setChoiceValues(['Так', 'Скоріше так', 'Скоріше ні', 'Ні'])
    .setRequired(true);

  // ── Блок Г. Відкриті відповіді ──────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Блок Г. Відкриті відповіді');

  form.addParagraphTextItem()
    .setTitle('14. Що найважливіше при виборі казки / мультфільму для дитини?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('15. Чого свідомо уникаєте при виборі контенту для дитини?')
    .setRequired(false);

  // Move to folder
  moveFileToFolder_(form.getId(), folder);
  return form;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ДОПОМІЖНІ ФУНКЦІЇ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Додає сітку оцінювання 1–5 для зразка
 */
function addRatingGrid_(form, prefix, criteria) {
  var grid = form.addGridItem();
  grid.setTitle(prefix + ' — Оцінка за критеріями (1 = найнижча, 5 = найвища)');
  grid.setRows(criteria);
  grid.setColumns(SCALE_5);
  grid.setRequired(true);
  return grid;
}

/**
 * Отримує або створює папку у Google Drive
 */
function getOrCreateFolder_(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(name);
}

/**
 * Переміщує файл до вказаної папки
 */
function moveFileToFolder_(fileId, folder) {
  var file = DriveApp.getFileById(fileId);
  file.moveTo(folder);
}
