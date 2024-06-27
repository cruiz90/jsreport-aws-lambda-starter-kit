
function getPage (root, id) {
    if (!root.$pdf) {
        // the main template
        return ''
    }
    for (let i = 0; i < root.$pdf.pages.length; i++) {
        const item = root.$pdf.pages[i].items.find(item => item.id === id)
        if (item) {
            return i + 1
        }
    }
}
