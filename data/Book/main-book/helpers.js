function level(chapters, opts, currentLevel = 0) {
    let res = ''

    for (const ch of chapters) {
        if (!ch.body) {
            return
        }
        if (currentLevel === 0) {
            res += '<div style=\'page-break-before: always;\'></div>';
            res += opts.fn({ ...ch,
                type: 'menu'
            });
        } else {
            res += opts.fn({ ...ch,
                type: 'submenu'
            });
        }

        if (ch.topicPages) {
            res += Handlebars.helpers.level(ch.topicPages, opts, currentLevel + 1)
        }
    }

    return res
}

function currentYear() {
    const date = new Date();
    return date.getFullYear();
}