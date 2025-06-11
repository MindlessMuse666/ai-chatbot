export const ru = {
  namespace: 'translation',
  common: {
    close: 'Закрыть',
  },
  translation: {
    auth: {
      email: "Email",
      name: "ФИО",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      username: "Имя пользователя",
      placeholder: {
        email: "Введите Email",
        name: "Введите ФИО",
        password: "Введите пароль",
        confirmPassword: "Повторите пароль",
        username: "Введите имя пользователя"
      },
      forgotPassword: "Забыли пароль?",
      forgotPasswordDescription: "Введите ваш адрес электронной почты, чтобы получить инструкции по восстановлению пароля.",
      login: "Вход",
      register: "Регистрация",
      submit: {
        login: "Войти",
        register: "Зарегистрироваться"
        register: "Зарегистрироваться",
        resetPassword: "Отправить"
      },
      backToLogin: "Вернуться к входу",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      createAccount: "Создать аккаунт",
      signIn: "Войти"
    },
    validation: {
      required: "Обязательное поле",
      email: "Некорректный email адрес",
      minLength: "Минимальная длина: {{length}} символов",
      passwordMatch: "Пароли не совпадают",
      invalidCredentials: "Неверный email или пароль"
    },
    button: {
      createChat: 'Создать чат',
      settings: 'Настройки',
      help: 'Помощь',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      rename: 'Переименовать'
    },
    sidebar: {
      footer: {
        copyright: '© 2025. Gravitino GPT',
        help: 'Поддержка'
      }
    },
    chat: {
      group: {
        today: 'Сегодня',
        yesterday: 'Вчера',
        tomorrow: 'Завтра',
        lastWeek: 'Последняя неделя',
        lastMonth: 'Последний месяц',
        lastYear: 'Последний год',
      },
      main: {
        title: 'Выберите или создайте чат',
        description: 'Для начала общения с ассистентом выберите существующий чат или создайте новый'
      },
      chatBox: {
        loading: 'Загрузка сообщений...',
        loadingPrevious: 'Загрузка предыдущих сообщений...',
        assistant: 'Ассистент',
        user: 'Вы',
        emptyTitle: 'Начните общение',
        emptyDescription: 'Отправьте сообщение, чтобы начать диалог с ассистентом',
        typing: 'печатает...'
      },
      placeholder: {
        send: 'Задайте свой вопрос...',
        title: 'Введите название чата'
      },
      modal: {
        rename: 'Изменить название чата',
        create: 'Создать новый чат',
        delete: 'Удалить чат',
        deleteConfirm: 'Вы уверены, что хотите удалить этот чат?'
      },
      validation: {
        titleRequired: 'Название чата обязательно',
        titleMinLength: 'Название должно содержать минимум 3 символа',
        titleMaxLength: 'Название не должно превышать 50 символов'
      },
      toast: {
        created: 'Чат успешно создан',
        renamed: 'Название чата изменено',
        deleted: 'Чат удален',
        error: 'Ошибка при выполнении операции'
      }
    },
    errors: {
      common: 'Произошла ошибка',
      unauthorized: 'Необходима авторизация',
      notFound: 'Ресурс не найден',
      validation: 'Ошибка валидации',
      server: 'Ошибка сервера',
      title: 'Ошибка загрузки',
      default: 'Произошла ошибка при загрузке данных',
      network: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету'
    },
    time: {
      today: 'Сегодня',
      yesterday: 'Вчера',
    },
    help: {
      title: 'Помощь и поддержка',
      email: 'info@gravitino.ru',
      description: 'По всем вопросам обращайтесь по электронной почте'
    },
    user: {
      block: 'Заблокировать',
      unblock: 'Разблокировать',
      delete: 'Удалить',
      edit: 'Редактировать',
      view: 'Просмотреть',
    },
    toast: {
      user: {
        blocked: 'Пользователь заблокирован',
        blockError: 'Не удалось заблокировать пользователя',
        unblocked: 'Пользователь разблокирован',
        unblockError: 'Не удалось разблокировать пользователя',
        deleted: 'Пользователь удален',
        deleteError: 'Не удалось удалить пользователя'
      },
      permission: {
        added: 'Права добавлены',
        addError: 'Не удалось добавить права',
        deleted: 'Права удалены',
        deleteError: 'Не удалось удалить права',
        edited: 'Права изменены',
        editError: 'Не удалось изменить права'
      },
      chat: {
        sendError: 'Не удалось отправить сообщение',
        limitExceeded: 'Превышен лимит на количество сообщений',
        chatLimitExceeded: 'Превышен лимит на создание чатов'
      },
      media: {
        uploadSuccess: 'Файл успешно загружен',
        uploadError: 'Не удалось загрузить файл'
      }
    },
    permission: {
      edit: 'Редактировать',
      delete: 'Удалить',
      add: 'Добавить права',
      title: 'Права доступа',
      name: 'Название',
      description: 'Описание',
      limitValue: 'Лимит',
      noLimit: 'Без лимита'
    }
  }
} 