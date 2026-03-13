# BPEDK Coursework

Статичний сайт для GitHub Pages з двома основними частинами:

- `survey/` — сторінки опитувань для різних груп респондентів
- `m/` — короткі маршрути для матеріалів корпусу

## Структура проєкту

```text
.
├── index.html
├── assets/
│   ├── app.js
│   ├── dice_animation.gif
│   └── styles.css
├── survey/
│   ├── survey.css
│   ├── survey.js
│   ├── educators/
│   │   ├── index.html
│   │   └── links.js
│   └── parents/
│       ├── index.html
│       └── links.js
├── m/
│   ├── styles.css
│   ├── grk/index.html  (V1: Ґруффало)
│   ├── pkd/index.html  (V2: Кротик і Панда)
│   ├── ssn/index.html  (V3: Шусть і Шуня)
│   ├── trk/index.html  (V4: Три пригоди Синього Трактора)
│   ├── tfi/index.html  (V5: Тофі і Таємниця)
│   ├── prs/index.html  (V6: Пригоди поросятка)
│   ├── spb/index.html  (T1: Навіщо кажуть "Спасибі")
│   ├── dub/index.html  (T2: Дуб під вікном)
│   ├── ksh/index.html  (T3: Покинуте кошеня)
│   ├── xhf/index.html  (T4: Теплий хлібчик)
│   ├── bbp/index.html  (T5: Бабусин пиріг)
│   ├── izh/index.html  (T6: Їжачкова знахідка)
│   ├── lsk/index.html  (T7: Лисичка і зернятко)
│   ├── snc/index.html  (T8: Сонечко і хмаринка)
│   └── pst/index.html  (T9: Пригоди Пстрика)
└── README.md
```

## Що за що відповідає

- `index.html` — стартова сторінка проєкту з переходом до сценаріїв опитування.
- `assets/` — спільні статичні ресурси для головної сторінки: GIF, стилі, додатковий JS.
- `survey/educators/` — сторінка опитування для вихователів.
- `survey/parents/` — сторінка опитування для батьків.
- `survey/survey.js` — спільна логіка таймера, прогрес-бару та випадкового переходу.
- `survey/survey.css` — спільні стилі для сторінок опитування.
- `m/` — короткі URL-маршрути до 15 одиниць корпусу.
- `m/grk`, `m/pkd`, `m/ssn`, `m/trk`, `m/tfi`, `m/prs` — відеоматеріали `V1-V6`.
- `m/spb`, `m/dub`, `m/ksh`, `m/xhf`, `m/bbp`, `m/izh`, `m/lsk`, `m/snc`, `m/pst` — текстові матеріали `T1-T9`.

## Корпус матеріалів

Корпус містить `15` одиниць у `4` категоріях.

| Індекс | Файл на сайті | Матеріал |
| --- | --- | --- |
| **V1** | `m/grk/index.html` | Ґруффало | https://drive.google.com/file/d/1FtbJWwuSbrPLpqI1wZK1TYpQh2sk2xMB/view?usp=drive_link
| **V2** | `m/pkd/index.html` | Кротик і Панда | https://drive.google.com/file/d/1bjV8dzFWfIAZ7fBuIUmbUV-Hz5WCNxDM/view?usp=drive_link
| **V3** | `m/ssn/index.html` | Шусть і Шуня | https://drive.google.com/file/d/1WpteT-Cy-9oAJm1W0Q64ivB7txN_ATaz/view?usp=drive_link
| **V4** | `m/trk/index.html` | Три пригоди Синього Трактора | https://drive.google.com/file/d/1LhilyuYdcGLy-BBYiEZoMXjGzxaA0JvE/view?usp=drive_link
| **V5** | `m/tfi/index.html` | Тофі і Таємниця | https://drive.google.com/file/d/1YD8EpeEsTCzYVeqhMQ4m58t2Ybx216OU/view?usp=drive_link
| **V6** | `m/prs/index.html` | Пригоди поросятка | https://drive.google.com/file/d/1Nht4L9CZ7lAaQ78M-RqYlBnyzeToMpUe/view?usp=drive_link
| **T1** | `m/spb/index.html` | «Навіщо кажуть "Спасибі"» |
| **T2** | `m/dub/index.html` | «Дуб під вікном» |
| **T3** | `m/ksh/index.html` | «Покинуте кошеня» |
| **T4** | `m/xhf/index.html` | «Теплий хлібчик» (структ.) |
| **T5** | `m/bbp/index.html` | «Бабусин пиріг» (структ.) |
| **T6** | `m/izh/index.html` | «Їжачкова знахідка» (структ.) |
| **T7** | `m/lsk/index.html` | «Лисичка і зернятко» (мін.) |
| **T8** | `m/snc/index.html` | «Сонечко і хмаринка» (мін.) |
| **T9** | `m/pst/index.html` | «Пригоди Пстрика» (мін.) |

## Індекси URL

| Індекс | Короткий URL |
| --- | --- |
| `V1` | `m/grk/` |
| `V2` | `m/pkd/` |
| `V3` | `m/ssn/` |
| `V4` | `m/trk/` |
| `V5` | `m/tfi/` |
| `V6` | `m/prs/` |
| `T1` | `m/spb/` |
| `T2` | `m/dub/` |
| `T3` | `m/ksh/` |
| `T4` | `m/xhf/` |
| `T5` | `m/bbp/` |
| `T6` | `m/izh/` |
| `T7` | `m/lsk/` |
| `T8` | `m/snc/` |
| `T9` | `m/pst/` |

## GitHub Pages

Проєкт розрахований на деплой через GitHub Pages з GitHub Actions.

1. Запушити репозиторій на GitHub.
2. У `Settings -> Pages` вибрати `Source: GitHub Actions`.
3. Після пушу в `main` сайт буде задеплоєний автоматично.
