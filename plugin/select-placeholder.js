import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

class SelectPlaceholder extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'selectPlaceholder', locale => {
			const dropdownView = createDropdown( locale );

			dropdownView.buttonView.set( {
				withText: true,
				label: 'Select placeholder',
			} );

			const items = new Collection();

			const placeholders = editor.config._config.placeholders;

			if ( placeholders ) {
				placeholders.forEach( x => {
					const item = {
						type: 'button',
						model: new Model( {
							withText: true,
							label: x.label,
							value: x.value
						} )
					};
					items.add( item );
				} );
			}

			addListToDropdown( dropdownView, items );

			const listView = dropdownView.listView;

			listView.on( 'execute', event => {
				const content = event.source.value;
				const viewFragment = editor.data.processor.toView( content );
				const modelFragment = editor.data.toModel( viewFragment );
				editor.model.insertContent( modelFragment );
			} );

			listView.items.delegate( 'execute' ).to( listView );

			return dropdownView;
		} );
	}
}

export default SelectPlaceholder;
