/* http://docs.angularjs.org/#!angular.widget */

angular.widget('pre', function(template){
  this.descend(true);
  this.directives(true);
  if (template.hasClass('markdown')) {
    var html = template.html();
    html =  new Showdown.converter().makeHtml(html);
    template.replaceWith(html);
  } else if (template.hasClass('code')){
    // since we are emulating jQuery we need to defer it.
    var $ = window.$;
    var pre = template;
    var html = pre.html();
    pre.html('');
    pre.css('display', 'block');
    pre.css('white-space', 'normal');
    pre.css('font-family', 'inherit');
    pre.css('font-size', 'inherit');
    window.$ = defer;

    html = html
      .replace(/===script===/mg, '<script>')
      .replace(/===\/script===/mg, '</script>')
      .replace(/&lt;/mg, '<')
      .replace(/&gt;/mg, '>')
      .replace(/&amp;/mg, '&');

    // turns out that <script> tag is removed in .html()
    // so we have to code it as p:script and the rename it.
    var example = angular.element('<fieldset>')
      .addClass('example')
      .append('<legend>Example</legend>')
      .append(angular.element('<div>').html(html));

    var code = angular.element('<fieldset>')
      .addClass('code')
      .append('<legend>Source</legend>')
      .append(angular.element('<pre>')
          .addClass('brush: js; html-script: true; toolbar: false;')
          .text(html));

    pre.append(example);
    pre.append(code);
    window.$ = $;
    defer(function(){
      if (document.fireEvent) {
        document.fireEvent('onload');
      } else {
        var evnt = document.createEvent('HTMLEvents');
        evnt.initEvent('load', true, false);
        document.dispatchEvent(evnt);
      }
    });
    return highlight;
  } else if (template.hasClass('code-only')){
    template.addClass('brush: js; html-script: true; toolbar: false;');
    return highlight;
  }

  // no DI in template function. :-(
  function defer(fn){
    window.setTimeout(fn, 0);
  };

  function highlight(){
    SyntaxHighlighter.highlight();
  }
});

angular.directive('x:key', function(key, element){
  var keyCodeMap = {
      'left-arrow': 37,
      'right-arrow': 39
  };
  var keyCode = keyCodeMap[key];
  return function($location, $updateView, element){
    $(document).keydown(function(event){
      if (event.keyCode == keyCode) {
        $location.hashPath = element.attr('href').substring(1);
        $updateView();
      }
    });
  };
});

angular.directive('x:scale', function(direction, element){
  var text = element.text();
  var before = ['<span style="font-size: 2em;">'];
  var after = ['</span>'];
  for ( var i = 0; i < text.length; i++) {
    if (direction == 'down') {
      before.push(text.charAt(i));
      before.push('<span style="font-size: 0.8em;">');
      after.push('</span>');
    } else if (direction == 'up') {
      before.push('<span style="font-size: 0.8em;">');
      after.push(text.charAt(i));
      after.push('</span>');
    }
  }
  element.replaceWith(before.join('') + after.join(''));
});
