class RenderList {
  constructor($element) {
    this.$element = $element
    this.cache = []
  }

  setItems(items) {
    while (this.$element.firstChild) {
      this.$element.removeChild(this.$element.firstChild)
    }

    items.forEach(item => {
      const cached = this.cache.find(oldItem => oldItem.key === item.key)
      if (cached) {
        this.$element.appendChild(cached.$element)
      } else {
        this.$element.appendChild(item.$element)
        this.cache.push(item)
      }
    })
  }
}

const createTemplate = template => {
  const $card = document.createElement('article')
    
  const $title = document.createElement('h2')
  $title.textContent = template.name
  $card.appendChild($title)

  const $img = document.createElement('img')
  $img.src = `templates/${template.fileName}`
  $card.appendChild($img)

  const $description = document.createElement('p')
  $description.textContent = template.description
  $card.appendChild($description)

  return $card
}

const main = async () => {
  const templates = await fetch('templates.json').then(res => res.json())
  console.log(templates)

  const options = {
    keys: [{
      name: 'name',
      weight: 0.5
    }, {
      name: 'description',
      weight: 0.4
    }, {
      name: 'fileName',
      weight: 0.1
    }]
  }
  const fuse = new Fuse(templates, options)

  
  const $search = document.querySelector('#search')
  const $templates = document.querySelector('#templates')
  const list = new RenderList($templates)
  
  $search.addEventListener('keyup', event => {

    if (!event.key.match(/[a-zA-Z]/)) {
      return
    }
    const searchTerm = $search.value
    const results = fuse.search(searchTerm)
    console.log(results)
    const items = results.map(result => ({
      key: result.refIndex,
      $element: createTemplate(result.item)
    }))
    list.setItems(items)
  })
}

main().catch(err => console.error(err))
