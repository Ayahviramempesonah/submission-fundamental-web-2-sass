
import 'bootstrap';

console.log(`lihat Bootstrap loaded`);

import './nav-bar.js'; // Import komponen nav-bar Anda

import './my-header.js';
import './my-footer.js';

import _ from 'lodash';

import './note-form-api.js';

import './style/style.css';
import './scss/styles.scss'; // Import SCSS Anda (pastikan pathnya benar)

// Import CSS Bootstrap (sekali saja)
import 'bootstrap/dist/css/bootstrap.min.css';

// Import JavaScript Bootstrap (pilih salah satu cara)

// Cara 1: Import semua komponen (lebih mudah, tapi bundle lebih besar)
// import 'bootstrap';

// Cara 2: Import komponen yang dibutuhkan saja (lebih efisien)
// import 'bootstrap/js/dist/util';
// import 'bootstrap/js/dist/dropdown';
// import 'bootstrap/js/dist/modal';
// ... import komponen lain yang Anda butuhkan

// Atau, jika Anda menggunakan named imports:
// import { Tooltip, Toast, Popover } from 'bootstrap';


// import './nav-bar.js'; // Import komponen nav-bar Anda


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}