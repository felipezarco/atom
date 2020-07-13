"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SIZE_ANY = 0;
exports.SIZE_ANY = SIZE_ANY;
var SIZE_SHORT = 1;
exports.SIZE_SHORT = SIZE_SHORT;
var SIZE_MEDIUM = 2;
exports.SIZE_MEDIUM = SIZE_MEDIUM;
var SIZE_LONG = 3;
exports.SIZE_LONG = SIZE_LONG;
var SIZE_VERY_LONG = 4;

exports.SIZE_VERY_LONG = SIZE_VERY_LONG;
var allSizes = [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG];

exports.allSizes = allSizes;
var HELP_URL = "https://github.com/shillingp/atom-lorem#how-to-use";

exports.HELP_URL = HELP_URL;
var shortWords = [
// Words with less than four letters
"a", "ab", "ad", "an", "aut", "de", "do", "e", "ea", "est", "et", "eu", "ex", "hic", "id", "iis", "in", "ita", "nam", "ne", "non", "o", "qui", "quo", "se", "sed", "si", "te", "ubi", "ut"];

var mediumWords = [
// Words with four to six letters
"amet", "aliqua", "anim", "aute", "cillum", "culpa", "dolor", "dolore", "duis", "elit", "enim", "eram", "esse", "fore", "fugiat", "illum", "ipsum", "irure", "labore", "legam", "magna", "malis", "minim", "multos", "nisi", "noster", "nulla", "quae", "quem", "quid", "quis", "quorum", "sint", "summis", "sunt", "tamen", "tempor", "export", "velit", "veniam"];

var longWords = [
// Words with seven to ten letters
"admodum", "aliquip", "appellat", "arbitror", "cernantur", "commodo", "consequat", "constias", "cupidatat", "deserunt", "doctrina", "eiusmod", "excepteur", "expetendis", "fabulas", "incididunt", "incurreret", "ingeniis", "iudicem", "laboris", "laborum", "litteris", "mandaremus", "mentitum", "nescius", "nostrud", "occaecat", "officia", "offendit", "pariatur", "possumus", "probant", "proident", "quamquam", "quibusdam", "senserit", "singulis", "ullamco", "vidisse", "voluptate"];

var veryLongWords = [
// Words with more than ten letters
"adipisicing", "arbitrantur", "cohaerescant", "comprehenderit", "concursionibus", "coniunctione", "consectetur", "despicationes", "distinguantur", "domesticarum", "efflorescere", "eruditionem", "exquisitaque", "exercitation", "familiaritatem", "fidelissimae", "firmissimum", "graviterque", "illustriora", "instituendarum", "imitarentur", "philosophari", "praesentibus", "praetermissum", "relinqueret", "reprehenderit", "sempiternum", "tractavissent", "transferrem", "voluptatibus"];

var wordLists = [shortWords, mediumWords, longWords, veryLongWords];
exports.wordLists = wordLists;
var allWords = [].concat.apply([], wordLists);

exports.allWords = allWords;
// Sentence fragment patterns, based off of randomly selected Latin phrases.
// Used to build all sentences and paragraphs.
var fragmentPatterns = [
// Three words
[SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG], [SIZE_SHORT, SIZE_MEDIUM, SIZE_VERY_LONG], [SIZE_SHORT, SIZE_SHORT, SIZE_VERY_LONG], [SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG], [SIZE_MEDIUM, SIZE_LONG, SIZE_LONG], [SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG], [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG], [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM], [SIZE_LONG, SIZE_SHORT, SIZE_LONG], [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG],

// Four words
[SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG], [SIZE_SHORT, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM], [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG], [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG], [SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_LONG], [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_LONG], [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_VERY_LONG], [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG], [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG], [SIZE_LONG, SIZE_VERY_LONG, SIZE_SHORT, SIZE_LONG],

// Five words
[SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM], [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG], [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG], [SIZE_MEDIUM, SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG], [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM], [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM], [SIZE_MEDIUM, SIZE_VERY_LONG, SIZE_LONG, SIZE_MEDIUM, SIZE_LONG], [SIZE_LONG, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG], [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM], [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG, SIZE_MEDIUM]];
exports.fragmentPatterns = fragmentPatterns;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvd29yZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztBQUVMLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQzs7QUFDbkIsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUNyQixJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7O0FBQ3RCLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQzs7QUFDcEIsSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDOzs7QUFFekIsSUFBTSxRQUFRLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQzs7O0FBRXRFLElBQU0sUUFBUSxHQUFHLG9EQUFvRCxDQUFDOzs7QUFFN0UsSUFBTSxVQUFVLEdBQUc7O0FBRWpCLEdBQUcsRUFDSCxJQUFJLEVBQ0osSUFBSSxFQUNKLElBQUksRUFDSixLQUFLLEVBQ0wsSUFBSSxFQUNKLElBQUksRUFDSixHQUFHLEVBQ0gsSUFBSSxFQUNKLEtBQUssRUFDTCxJQUFJLEVBQ0osSUFBSSxFQUNKLElBQUksRUFDSixLQUFLLEVBQ0wsSUFBSSxFQUNKLEtBQUssRUFDTCxJQUFJLEVBQ0osS0FBSyxFQUNMLEtBQUssRUFDTCxJQUFJLEVBQ0osS0FBSyxFQUNMLEdBQUcsRUFDSCxLQUFLLEVBQ0wsS0FBSyxFQUNMLElBQUksRUFDSixLQUFLLEVBQ0wsSUFBSSxFQUNKLElBQUksRUFDSixLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7O0FBRUYsSUFBTSxXQUFXLEdBQUc7O0FBRWxCLE1BQU0sRUFDTixRQUFRLEVBQ1IsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLE9BQU8sRUFDUCxRQUFRLEVBQ1IsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8s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U0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUNwRCxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxFQUM5QyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxFQUMvQyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxFQUNwRCxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxFQUMvQyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUM5QyxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQzs7O0FBR2xELENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUMvRCxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFDN0QsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLEVBQzlELENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxFQUM3RCxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFDN0QsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLEVBQzlELENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxFQUNoRSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFDL0QsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLEVBQzlELENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUM5RCxDQUFDIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvd29yZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgY29uc3QgU0laRV9BTlkgPSAwO1xuZXhwb3J0IGNvbnN0IFNJWkVfU0hPUlQgPSAxO1xuZXhwb3J0IGNvbnN0IFNJWkVfTUVESVVNID0gMjtcbmV4cG9ydCBjb25zdCBTSVpFX0xPTkcgPSAzO1xuZXhwb3J0IGNvbnN0IFNJWkVfVkVSWV9MT05HID0gNDtcblxuZXhwb3J0IGNvbnN0IGFsbFNpemVzID0gW1NJWkVfU0hPUlQsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkcsIFNJWkVfVkVSWV9MT05HXTtcblxuZXhwb3J0IGNvbnN0IEhFTFBfVVJMID0gXCJodHRwczovL2dpdGh1Yi5jb20vc2hpbGxpbmdwL2F0b20tbG9yZW0jaG93LXRvLXVzZVwiO1xuXG5jb25zdCBzaG9ydFdvcmRzID0gW1xuICAvLyBXb3JkcyB3aXRoIGxlc3MgdGhhbiBmb3VyIGxldHRlcnNcbiAgXCJhXCIsXG4gIFwiYWJcIixcbiAgXCJhZFwiLFxuICBcImFuXCIsXG4gIFwiYXV0XCIsXG4gIFwiZGVcIixcbiAgXCJkb1wiLFxuICBcImVcIixcbiAgXCJlYVwiLFxuICBcImVzdFwiLFxuICBcImV0XCIsXG4gIFwiZXVcIixcbiAgXCJleFwiLFxuICBcImhpY1wiLFxuICBcImlkXCIsXG4gIFwiaWlzXCIsXG4gIFwiaW5cIixcbiAgXCJpdGFcIixcbiAgXCJuYW1cIixcbiAgXCJuZVwiLFxuICBcIm5vblwiLFxuICBcIm9cIixcbiAgXCJxdWlcIixcbiAgXCJxdW9cIixcbiAgXCJzZVwiLFxuICBcInNlZFwiLFxuICBcInNpXCIsXG4gIFwidGVcIixcbiAgXCJ1YmlcIixcbiAgXCJ1dFwiLFxuXTtcblxuY29uc3QgbWVkaXVtV29yZHMgPSBbXG4gIC8vIFdvcmRzIHdpdGggZm91ciB0byBzaXggbGV0dGVyc1xuICBcImFtZXRcIixcbiAgXCJhbGlxdWFcIixcbiAgXCJhbmltXCIsXG4gIFwiYXV0ZVwiLFxuICBcImNpbGx1bVwiLFxuICBcImN1bHBhXCIsXG4gIFwiZG9sb3JcIixcbiAgXCJkb2xvcmVcIixcbiAgXCJkdWlzXCIsXG4gIFwiZWxpdFwiLFxuICBcImVuaW1cIixcbiAgXCJlcmFtXCIsXG4gIFwiZXNzZVwiLFxuICBcImZvcmVcIixcbiAgXCJmdWdpYXRcIixcbiAgXCJpbGx1bVwiLFxuICBcImlwc3VtXCIsXG4gIFwiaXJ1cmVcIixcbiAgXCJsYWJvcmVcIixcbiAgXCJsZWdhbVwiLFxuICBcIm1hZ25hXCIsXG4gIFwibWFsaXNcIixcbiAgXCJtaW5pbVwiLFxuICBcIm11bHRvc1wiLFxuICBcIm5pc2lcIixcbiAgXCJub3N0ZXJcIixcbiAgXCJudWxsYVwiLFxuICBcInF1YWVcIixcbiAgXCJxdWVtXCIsXG4gIFwicXVpZFwiLFxuICBcInF1aXNcIixcbiAgXCJxdW9ydW1cIixcbiAgXCJzaW50XCIsXG4gIFwic3VtbWlzXCIsXG4gIFwic3VudFwiLFxuICBcInRhbWVuXCIsXG4gIFwidGVtcG9yXCIsXG4gIFwiZXhwb3J0XCIsXG4gIFwidmVsaXRcIixcbiAgXCJ2ZW5pYW1cIixcbl07XG5cbmNvbnN0IGxvbmdXb3JkcyA9IFtcbiAgLy8gV29yZHMgd2l0aCBzZXZlbiB0byB0ZW4gbGV0dGVyc1xuICBcImFkbW9kdW1cIixcbiAgXCJhbGlxdWlwXCIsXG4gIFwiYXBwZWxsYXRcIixcbiAgXCJhcmJpdHJvclwiLFxuICBcImNlcm5hbnR1clwiLFxuICBcImNvbW1vZG9cIixcbiAgXCJjb25zZXF1YXRcIixcbiAgXCJjb25zdGlhc1wiLFxuICBcImN1cGlkYXRhdFwiLFxuICBcImRlc2VydW50XCIsXG4gIFwiZG9jdHJpbmFcIixcbiAgXCJlaXVzbW9kXCIsXG4gIFwiZXhjZXB0ZXVyXCIsXG4gIFwiZXhwZXRlbmRpc1wiLFxuICBcImZhYnVsYXNcIixcbiAgXCJpbmNpZGlkdW50XCIsXG4gIFwiaW5jdXJyZXJldFwiLFxuICBcImluZ2VuaWlzXCIsXG4gIFwiaXVkaWNlbVwiLFxuICBcImxhYm9yaXNcIixcbiAgXCJsYWJvcnVtXCIsXG4gIFwibGl0dGVyaXNcIixcbiAgXCJtYW5kYXJlbXVzXCIsXG4gIFwibWVudGl0dW1cIixcbiAgXCJuZXNjaXVzXCIsXG4gIFwibm9zdHJ1ZFwiLFxuICBcIm9jY2FlY2F0XCIsXG4gIFwib2ZmaWNpYVwiLFxuICBcIm9mZmVuZGl0XCIsXG4gIFwicGFyaWF0dXJcIixcbiAgXCJwb3NzdW11c1wiLFxuICBcInByb2JhbnRcIixcbiAgXCJwcm9pZGVudFwiLFxuICBcInF1YW1xdWFtXCIsXG4gIFwicXVpYnVzZGFtXCIsXG4gIFwic2Vuc2VyaXRcIixcbiAgXCJzaW5ndWxpc1wiLFxuICBcInVsbGFtY29cIixcbiAgXCJ2aWRpc3NlXCIsXG4gIFwidm9sdXB0YXRlXCIsXG5dO1xuXG5jb25zdCB2ZXJ5TG9uZ1dvcmRzID0gW1xuICAvLyBXb3JkcyB3aXRoIG1vcmUgdGhhbiB0ZW4gbGV0dGVyc1xuICBcImFkaXBpc2ljaW5nXCIsXG4gIFwiYXJiaXRyYW50dXJcIixcbiAgXCJjb2hhZXJlc2NhbnRcIixcbiAgXCJjb21wcmVoZW5kZXJpdFwiLFxuICBcImNvbmN1cnNpb25pYnVzXCIsXG4gIFwiY29uaXVuY3Rpb25lXCIsXG4gIFwiY29uc2VjdGV0dXJcIixcbiAgXCJkZXNwaWNhdGlvbmVzXCIsXG4gIFwiZGlzdGluZ3VhbnR1clwiLFxuICBcImRvbWVzdGljYXJ1bVwiLFxuICBcImVmZmxvcmVzY2VyZVwiLFxuICBcImVydWRpdGlvbmVtXCIsXG4gIFwiZXhxdWlzaXRhcXVlXCIsXG4gIFwiZXhlcmNpdGF0aW9uXCIsXG4gIFwiZmFtaWxpYXJpdGF0ZW1cIixcbiAgXCJmaWRlbGlzc2ltYWVcIixcbiAgXCJmaXJtaXNzaW11bVwiLFxuICBcImdyYXZpdGVycXVlXCIsXG4gIFwiaWxsdXN0cmlvcmFcIixcbiAgXCJpbnN0aXR1ZW5kYXJ1bVwiLFxuICBcImltaXRhcmVudHVyXCIsXG4gIFwicGhpbG9zb3BoYXJpXCIsXG4gIFwicHJhZXNlbnRpYnVzXCIsXG4gIFwicHJhZXRlcm1pc3N1bVwiLFxuICBcInJlbGlucXVlcmV0XCIsXG4gIFwicmVwcmVoZW5kZXJpdFwiLFxuICBcInNlbXBpdGVybnVtXCIsXG4gIFwidHJhY3Rhdmlzc2VudFwiLFxuICBcInRyYW5zZmVycmVtXCIsXG4gIFwidm9sdXB0YXRpYnVzXCIsXG5dO1xuXG5leHBvcnQgY29uc3Qgd29yZExpc3RzID0gW3Nob3J0V29yZHMsIG1lZGl1bVdvcmRzLCBsb25nV29yZHMsIHZlcnlMb25nV29yZHNdO1xuZXhwb3J0IGNvbnN0IGFsbFdvcmRzID0gW10uY29uY2F0LmFwcGx5KFtdLCB3b3JkTGlzdHMpO1xuXG4vLyBTZW50ZW5jZSBmcmFnbWVudCBwYXR0ZXJucywgYmFzZWQgb2ZmIG9mIHJhbmRvbWx5IHNlbGVjdGVkIExhdGluIHBocmFzZXMuXG4vLyBVc2VkIHRvIGJ1aWxkIGFsbCBzZW50ZW5jZXMgYW5kIHBhcmFncmFwaHMuXG5leHBvcnQgY29uc3QgZnJhZ21lbnRQYXR0ZXJucyA9IFtcbiAgLy8gVGhyZWUgd29yZHNcbiAgW1NJWkVfU0hPUlQsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkddLFxuICBbU0laRV9TSE9SVCwgU0laRV9NRURJVU0sIFNJWkVfVkVSWV9MT05HXSxcbiAgW1NJWkVfU0hPUlQsIFNJWkVfU0hPUlQsIFNJWkVfVkVSWV9MT05HXSxcbiAgW1NJWkVfU0hPUlQsIFNJWkVfTE9ORywgU0laRV9WRVJZX0xPTkddLFxuICBbU0laRV9NRURJVU0sIFNJWkVfTE9ORywgU0laRV9MT05HXSxcbiAgW1NJWkVfTUVESVVNLCBTSVpFX0xPTkcsIFNJWkVfVkVSWV9MT05HXSxcbiAgW1NJWkVfTUVESVVNLCBTSVpFX1NIT1JULCBTSVpFX0xPTkddLFxuICBbU0laRV9MT05HLCBTSVpFX1NIT1JULCBTSVpFX01FRElVTV0sXG4gIFtTSVpFX0xPTkcsIFNJWkVfU0hPUlQsIFNJWkVfTE9OR10sXG4gIFtTSVpFX0xPTkcsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkddLFxuXG4gIC8vIEZvdXIgd29yZHNcbiAgW1NJWkVfU0hPUlQsIFNJWkVfU0hPUlQsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkddLFxuICBbU0laRV9TSE9SVCwgU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfTUVESVVNXSxcbiAgW1NJWkVfU0hPUlQsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkcsIFNJWkVfTE9OR10sXG4gIFtTSVpFX1NIT1JULCBTSVpFX01FRElVTSwgU0laRV9MT05HLCBTSVpFX1ZFUllfTE9OR10sXG4gIFtTSVpFX1NIT1JULCBTSVpFX0xPTkcsIFNJWkVfU0hPUlQsIFNJWkVfTE9OR10sXG4gIFtTSVpFX01FRElVTSwgU0laRV9MT05HLCBTSVpFX1NIT1JULCBTSVpFX0xPTkddLFxuICBbU0laRV9NRURJVU0sIFNJWkVfTE9ORywgU0laRV9TSE9SVCwgU0laRV9WRVJZX0xPTkddLFxuICBbU0laRV9MT05HLCBTSVpFX1NIT1JULCBTSVpFX01FRElVTSwgU0laRV9MT05HXSxcbiAgW1NJWkVfTE9ORywgU0laRV9NRURJVU0sIFNJWkVfTE9ORywgU0laRV9MT05HXSxcbiAgW1NJWkVfTE9ORywgU0laRV9WRVJZX0xPTkcsIFNJWkVfU0hPUlQsIFNJWkVfTE9OR10sXG5cbiAgLy8gRml2ZSB3b3Jkc1xuICBbU0laRV9TSE9SVCwgU0laRV9TSE9SVCwgU0laRV9NRURJVU0sIFNJWkVfTUVESVVNLCBTSVpFX01FRElVTV0sXG4gIFtTSVpFX1NIT1JULCBTSVpFX01FRElVTSwgU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfTE9OR10sXG4gIFtTSVpFX1NIT1JULCBTSVpFX01FRElVTSwgU0laRV9NRURJVU0sIFNJWkVfTUVESVVNLCBTSVpFX0xPTkddLFxuICBbU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfU0hPUlQsIFNJWkVfTUVESVVNLCBTSVpFX0xPTkddLFxuICBbU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfTE9ORywgU0laRV9TSE9SVCwgU0laRV9NRURJVU1dLFxuICBbU0laRV9NRURJVU0sIFNJWkVfTE9ORywgU0laRV9TSE9SVCwgU0laRV9NRURJVU0sIFNJWkVfTUVESVVNXSxcbiAgW1NJWkVfTUVESVVNLCBTSVpFX1ZFUllfTE9ORywgU0laRV9MT05HLCBTSVpFX01FRElVTSwgU0laRV9MT05HXSxcbiAgW1NJWkVfTE9ORywgU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfTE9ORywgU0laRV9WRVJZX0xPTkddLFxuICBbU0laRV9MT05HLCBTSVpFX01FRElVTSwgU0laRV9NRURJVU0sIFNJWkVfU0hPUlQsIFNJWkVfTUVESVVNXSxcbiAgW1NJWkVfTE9ORywgU0laRV9NRURJVU0sIFNJWkVfTUVESVVNLCBTSVpFX0xPTkcsIFNJWkVfTUVESVVNXSxcbl07XG4iXX0=