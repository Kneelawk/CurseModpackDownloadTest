// index.js - facilitates modes of operation (tabs and stuff)

// const $ = require('./jquery/jquery-3.1.1.min.js');

function selectTab(tab) {
  $('#tabs').children().removeClass('selected');
  tab.addClass('selected');
  let contentId = '#' + tab.attr('id') + '-content';
  $('#tabs').children().each(function () {
    let ccid = '#' + $(this).attr('id') + '-content';
    if (ccid != contentId) {
      $(ccid).hide();
    }
  });
  $(contentId).show();
}

$(function () {
  $('#tabs span').click(function () {
    console.log('Tab clicked: ' + $(this));
    if (!$('#tabs').hasClass('disabled') && !$(this).hasClass('disabled')) {
      console.log('Tab selected: ' + $(this));
      selectTab($(this));
    }
  });
});

function disableLogin() {
  $('#login').addClass('disabled');
}
