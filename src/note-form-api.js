class NoteFormApi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.baseUrl = 'https://notes-api.dicoding.dev/v2'; // Base URL API
  }

  connectedCallback() {
    this.render();
    this.fetchNotes(); // Ambil data catatan saat komponen dimuat
  }

  // Render form dan container
  render() {
    this.shadowRoot.innerHTML = `
        <style>
          /* Gaya untuk formulir */
          .note-form {
            font-size: 46px;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 0;
            margin: 0;
            font-family: "Kaushan Script", serif;
            font-weight: 800;
            font-style: normal;
          }
  
          .form-group {
            display: flex;
            flex-direction: column;
            font-family: "Kaushan Script", serif;
            font-weight: 400;
            font-style: normal;
          }
  
          button {
            font-family: "Kaushan Script", serif;
            font-weight: 400;
            font-style: normal;
            height: 3rem;
            font-size: 2rem;
            margin: 0.5rem;
          }
  
          label {
            color: white;
            font-weight: bold;
          }
  
          textarea {
            height: 7rem;
          }
  
          input {
            height: 5rem;
          }
  
          /* Gaya untuk daftar catatan */
          .list-container {
            margin-top: 1rem;
            display: grid;
            gap: 1rem;
            font-family: "Kaushan Script", serif;
            font-weight: 400;
            font-style: normal;
            overflow-y: auto;
          }
  
          @media (max-width: 768px) {
            .list-container {
              grid-template-columns: repeat(1, 1fr);
            }
          }
  
          @media (min-width: 769px) and (max-width: 1024px) {
            .list-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }
  
          @media (min-width: 1025px) {
            .list-container {
              grid-template-columns: repeat(3, 1fr);
            }
          }
  
        .note {
          border: 1px solid #ccc;
          padding: 1rem;
          margin-bottom: 1rem;
          opacity: 0; /* Awalnya tidak terlihat */
          transform: translateY(20px); /* Awalnya sedikit ke bawah */
          animation: fadeInUp 0.5s ease-out forwards; /* Animasi muncul */
        }  
        .note.archived {
          background-color: #fff3cd; /* Warna kuning untuk catatan yang diarsipkan */
        }

        /* Animasi fadeInUp */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /*gaya untuk indicator loading*/
        .loading{
        display:flex;
        justify-conter:center;
        align-items:center;
        font-size:1.5rem;
        margin:1rem 0;
        }

        .loading::after{
        content:"";
        display:inline-block;
        width:1.5rem;
        height:1.5rem;
        border:3px solid #ccc;
        border-radius:50%;
        border-top-color:#333;
        animation:spin 3s linear infinite;
        }

        @keyframes spin{
        to{
        transform:rotate(360deg);
        }

        }
         
         
         
         
         
            }

        /* Animasi untuk tombol */
        button:hover {
          animation: bounce 0.5s;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }



        </style>
        <form class="note-form">
          <div class="form-group">
            <label for="title">Judul:</label>
            <input type="text" id="title" name="title" required pattern="[a-zA-Z0-9\s]+" title="Judul hanya boleh mengandung huruf, angka, dan spasi.">
          </div>
          <div class="form-group">
            <label for="body">Isi:</label>
            <textarea id="body" name="body" required></textarea>
          </div>
          <button type="submit">Tambah</button>
        </form>

        <div class="loading" id="loading" style="display:none;">Memuat Data...</div>

        <div class="list-container" id="list-container"></div>
      `;

    //  event listener untuk form
    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createNote();
    });
  }

  // buat fungsi loading aktif
  showLoading() {
    const loading = this.shadowRoot.querySelector('#loading');
    loading.style.display = 'flex';
  }

  //sembunyikan indicator loading
  hideLoading() {
    const loading = this.shadowRoot.querySelector('#loading');
    loading.style.display = 'none';
  }

  // Ambil data catatan dari API
  async fetchNotes() {
    this.showLoading();

    try {
      const [activeNotesResponse, archivedNotesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/notes`),
        fetch(`${this.baseUrl}/notes/archived`),
      ]);

      const activeNotesData = await activeNotesResponse.json();
      const archivedNotesData = await archivedNotesResponse.json();

      if (activeNotesData.status === 'success' && archivedNotesData.status === 'success') {
        const allNotes = [...activeNotesData.data, ...archivedNotesData.data];
        this.displayNotes(allNotes);
      } else {
        console.error('Gagal mengambil catatan:', activeNotesData.message || archivedNotesData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.hideLoading();
    }
  }

  // Tampilkan catatan di halaman
  displayNotes(notes) {
    const listContainer = this.shadowRoot.querySelector('#list-container');
    listContainer.innerHTML = ''; // Kosongkan container sebelum menambahkan catatan baru

    notes.forEach((note) => {
      const noteElement = this.createNoteElement(note);
      listContainer.appendChild(noteElement);
    });
  }

  // Buat elemen catatan
  createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    if (note.archived) {
      noteElement.classList.add('archived');
    }

    const titleElement = document.createElement('h3');
    titleElement.textContent = note.title;

    const idElement = document.createElement('p');
    idElement.textContent = `ID: ${note.id}`;

    const createdAtElement = document.createElement('p');
    createdAtElement.textContent = `Dibuat Pada: ${new Date(note.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;

    const bodyElement = document.createElement('p');
    bodyElement.textContent = note.body;

    const archiveButton = document.createElement('button');
    archiveButton.textContent = note.archived ? 'Unarchive' : 'Archive';
    archiveButton.addEventListener('click', () => {
      if (note.archived) {
        this.unarchiveNote(note.id);
      } else {
        this.archiveNote(note.id);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', () => {
      this.deleteNote(note.id);
    });

    noteElement.append(titleElement, idElement, createdAtElement, bodyElement, archiveButton, deleteButton);
    return noteElement;
  }

  // Buat catatan baru
  async createNote() {
    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');

    const newNote = {
      title: titleInput.value,
      body: bodyInput.value,
    };

    try {
      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Catatan berhasil dibuat!');
        this.fetchNotes(); // Ambil ulang data catatan
        titleInput.value = ''; // Reset form
        bodyInput.value = ''; // Reset form
      } else {
        alert('Gagal membuat catatan: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat membuat catatan.');
    }
  }

  // Arsipkan catatan
  async archiveNote(noteId) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${noteId}/archive`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Catatan berhasil diarsipkan!');
        this.fetchNotes(); // Ambil ulang data catatan
      } else {
        alert('Gagal mengarsipkan catatan: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengarsipkan catatan.');
    }
  }

  // Batalkan pengarsipan catatan
  async unarchiveNote(noteId) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${noteId}/unarchive`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Catatan berhasil dibatalkan pengarsipannya!');
        this.fetchNotes(); // Ambil ulang data catatan
      } else {
        alert('Gagal membatalkan pengarsipan catatan: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat membatalkan pengarsipan catatan.');
    }
  }

  // Hapus catatan
  async deleteNote(noteId) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Catatan berhasil dihapus!');
        this.fetchNotes(); // Ambil ulang data catatan
      } else {
        alert('Gagal menghapus catatan: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus catatan.');
    }
  }
}

// panggil  custom element disini
customElements.define('note-form-api', NoteFormApi);
