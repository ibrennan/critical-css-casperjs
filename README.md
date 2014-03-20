Critical CSS - CasperJS
=====================

Author: @nannerB / http://ibrennan.co.uk

Inspired by this post from Paul Kinlan: http://paul.kinlan.me/detecting-critical-above-the-fold-css/

JS functionality based on this snippet: https://gist.github.com/PaulKinlan/6284142

Instructions for use:

1. Ensure you have CasperJS installed on your machine: http://casperjs.org
2. Copy critical-css.js to you project root directory.
3. Open Terminal, and CD to your site directory "CD ~/path/to/site/root"
4. Then run "casperjs critical-css.js"
5. Follow the prompts on screen
7. It will ask you for the URL you'd like to parse
8. Then the output file, you can leave this blank and it will default to "critical-css.txt"
9. Then it will finally ask for the browser dimensions you'd like to use, this is useful for doing responsive sites. If left blank will default to 1024x768.
10. Open your output file, and copy it's contents
11. Paste the contents into your sites <head> section (before your .css link href's)
12. Enjoy your freshly optimised site.


You can see the improvements by doing a before an after analysis with this tool: https://developers.google.com/speed/pagespeed/insights/

There is an opportunity to use this script as part of your build processes, one day I may look at writing a Grunt package to do this.
