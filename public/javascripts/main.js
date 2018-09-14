$(function () {
  'use strict';

  if (!window.FileReader || !window.localStorage) {
    alert('ブラウザが対応していません');
    return;
  }

  if (localStorage['image_file']) {
    set_img($('.preview'));
  }

  $('form').on('change', 'input[type="file"]', function (e) {
    var file = e.target.files[0];
    if (!file.type.match('image\.(jpeg|png)')) {
      return;
    }

    var reader = new FileReader();
    reader.onload = (function (file) {
      return function (e) {
        set_img($('.preview'), e.target.result);
        localStorage.clear();
        localStorage.setItem('image_file', e.target.result);
      };
    })(file);
    reader.readAsDataURL(file);
  });

  $('form').on('keypress', 'input[type="text"]', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $.ajax({
        url: '/',
        type: 'POST',
        data: {
          'cmd': e.target.value,
          'image_file': localStorage.getItem('image_file')
        }
      })
      .done((data) => {
        set_img($('.convert'), data.image_file);
      })
      .fail((data) => {
        console.error('ajax error');
      });
    }
  });

  function set_img($elm, image_file = localStorage.getItem('image_file')) {
    $elm.empty();
    $elm.append($('<img>').attr({ src: image_file }));
  }
});
