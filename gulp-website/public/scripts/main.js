class Person {
  constructor (name) {
    this.name = name
  }
  hello() {
    if (typeof this.name === 'string') {
      return `Hello, I am ${this.name}!`
    } else {
      return 'Hello!'
    }
  }
}

var person = new Person('Dex')
var greetHtml = templates['greeting']({
  message: person.hello()
})

document.write(greetHtml)
