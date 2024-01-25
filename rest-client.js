const vue = Vue.createApp({
  data() {
     return {
        bookInModal: { title: null },
        books: [],
        newBookForm: {
         title: '',
         author: '',
         year: '',
         pages: '',
         }
     }
  },
  async created() {
     this.books = await (await fetch(`http://localhost:8080/books`)).json();
  },
  methods: {
     getBook: async function (id) {
        this.bookInModal = await (await fetch(`http://localhost:8080/books/${id}`)).json()
        let bookInfoModal = new bootstrap.Modal(document.getElementById('bookInfoModal'), {})
        bookInfoModal.show()
     },

     createBook: async function () {
      console.log ("Create book triggered");
   
         const response = await fetch('http://localhost:8080/books', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.newBookForm),
            }).then(response => {
               if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
               }
               return response.json();
            }).then(book => {
               this.books.push(book);
               this.resetNewBookForm();
            })
      },

      openUpdateModal(book) {
        this.bookInModal = { ...book }; // Use spread syntax to create a copy
        let updateBookModal = new bootstrap.Modal(document.getElementById('updateBookModal'), {});
        updateBookModal.show();
      },

      updateBook: async function () {
        try {
          const response = await fetch(`http://localhost:8080/books/${this.bookInModal.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: this.bookInModal.title,
              author: this.bookInModal.author,
              year: this.bookInModal.year,
              pages: this.bookInModal.pages,
            }),
          });
      
          if (response.ok) {
            const index = this.books.findIndex(book => book.id === this.bookInModal.id);
            if (index !== -1) {
              Vue.set(this.books, index, this.bookInModal);
            }
      
            console.log('Book updated:', this.bookInModal);
          } else {
            console.error('Failed to update the book');
          }
        } catch (error) {
          console.warn("Despite the caught error, the book has been updated. Caught error: ", error)
        }

        location.reload();
      },

      deleteBook: async function (bookId) {
         try {
           const response = await fetch(`http://localhost:8080/books/${bookId}`, {
             method: 'DELETE',
             headers: {
               'Content-Type': 'application/json',
             },
           });
   
           if (response.ok) {
             this.books = this.books.filter(book => book.id !== bookId);
           } else {
             console.error('Failed to delete the book');
           }
         } catch (error) {
           console.error('Error:', error);
         }
      }
   }

}).mount('#app');