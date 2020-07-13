Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.deactivate = deactivate;
exports.activate = activate;
/** @babel */

var _atom = require('atom');

var _loophole = require('loophole');

var uglify = undefined;
(0, _loophole.allowUnsafeNewFunction)(function () {
	uglify = require('uglify-js');
});

function init(editor) {
	var selectedText = editor.getSelectedText();
	var text = selectedText || editor.getText();
	var retText = '';

	try {
		(0, _loophole.allowUnsafeNewFunction)(function () {
			retText = uglify.minify(text, {
				fromString: true,
				mangle: atom.config.get('uglify.mangle')
			}).code;
		});
	} catch (err) {
		console.error(err);
		atom.notifications.addError('Uglify', { detail: err.message });
		return;
	}

	var cursorPosition = editor.getCursorBufferPosition();
	var line = atom.views.getView(editor).getFirstVisibleScreenRow() + editor.getVerticalScrollMargin();

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.getBuffer().setTextViaDiff(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);

	if (editor.getScreenLineCount() > line) {
		editor.scrollToScreenPosition([line, 0]);
	}
}

var config = {
	mangle: {
		type: 'boolean',
		'default': true
	}
};

exports.config = config;

function deactivate() {
	this.subscriptions.dispose();
}

function activate() {
	this.subscriptions = new _atom.CompositeDisposable();

	this.subscriptions.add(atom.commands.add('atom-workspace', 'uglify', function () {
		var editor = atom.workspace.getActiveTextEditor();

		if (editor) {
			init(editor);
		}
	}));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy91Z2xpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztvQkFDa0MsTUFBTTs7d0JBQ0gsVUFBVTs7QUFFL0MsSUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLHNDQUF1QixZQUFNO0FBQzVCLE9BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Q0FDOUIsQ0FBQyxDQUFDOztBQUVILFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQixLQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDOUMsS0FBTSxJQUFJLEdBQUcsWUFBWSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxLQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLEtBQUk7QUFDSCx3Q0FBdUIsWUFBTTtBQUM1QixVQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDN0IsY0FBVSxFQUFFLElBQUk7QUFDaEIsVUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDO0dBQ1IsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNiLFNBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsTUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQzdELFNBQU87RUFDUDs7QUFFRCxLQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUN4RCxLQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxHQUNqRSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7QUFFbEMsS0FBSSxZQUFZLEVBQUU7QUFDakIsUUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ3RFLE1BQU07QUFDTixRQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQzNDOztBQUVELE9BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFL0MsS0FBSSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxJQUFJLEVBQUU7QUFDdkMsUUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekM7Q0FDRDs7QUFFTSxJQUFNLE1BQU0sR0FBRztBQUNyQixPQUFNLEVBQUU7QUFDUCxNQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsSUFBSTtFQUNiO0NBQ0QsQ0FBQzs7OztBQUVLLFNBQVMsVUFBVSxHQUFHO0FBQzVCLEtBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDN0I7O0FBRU0sU0FBUyxRQUFRLEdBQUc7QUFDMUIsS0FBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFlBQU07QUFDMUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxNQUFJLE1BQU0sRUFBRTtBQUNYLE9BQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNiO0VBQ0QsQ0FBQyxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvdWdsaWZ5L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7YWxsb3dVbnNhZmVOZXdGdW5jdGlvbn0gZnJvbSAnbG9vcGhvbGUnO1xuXG5sZXQgdWdsaWZ5O1xuYWxsb3dVbnNhZmVOZXdGdW5jdGlvbigoKSA9PiB7XG5cdHVnbGlmeSA9IHJlcXVpcmUoJ3VnbGlmeS1qcycpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXQoZWRpdG9yKSB7XG5cdGNvbnN0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKTtcblx0Y29uc3QgdGV4dCA9IHNlbGVjdGVkVGV4dCB8fCBlZGl0b3IuZ2V0VGV4dCgpO1xuXHRsZXQgcmV0VGV4dCA9ICcnO1xuXG5cdHRyeSB7XG5cdFx0YWxsb3dVbnNhZmVOZXdGdW5jdGlvbigoKSA9PiB7XG5cdFx0XHRyZXRUZXh0ID0gdWdsaWZ5Lm1pbmlmeSh0ZXh0LCB7XG5cdFx0XHRcdGZyb21TdHJpbmc6IHRydWUsXG5cdFx0XHRcdG1hbmdsZTogYXRvbS5jb25maWcuZ2V0KCd1Z2xpZnkubWFuZ2xlJylcblx0XHRcdH0pLmNvZGU7XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1VnbGlmeScsIHtkZXRhaWw6IGVyci5tZXNzYWdlfSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcblx0Y29uc3QgbGluZSA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpICtcblx0XHRlZGl0b3IuZ2V0VmVydGljYWxTY3JvbGxNYXJnaW4oKTtcblxuXHRpZiAoc2VsZWN0ZWRUZXh0KSB7XG5cdFx0ZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCksIHJldFRleHQpO1xuXHR9IGVsc2Uge1xuXHRcdGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0VmlhRGlmZihyZXRUZXh0KTtcblx0fVxuXG5cdGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihjdXJzb3JQb3NpdGlvbik7XG5cblx0aWYgKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSA+IGxpbmUpIHtcblx0XHRlZGl0b3Iuc2Nyb2xsVG9TY3JlZW5Qb3NpdGlvbihbbGluZSwgMF0pO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG5cdG1hbmdsZToge1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRkZWZhdWx0OiB0cnVlXG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuXHR0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cblx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndWdsaWZ5JywgKCkgPT4ge1xuXHRcdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRcdGlmIChlZGl0b3IpIHtcblx0XHRcdGluaXQoZWRpdG9yKTtcblx0XHR9XG5cdH0pKTtcbn1cbiJdfQ==