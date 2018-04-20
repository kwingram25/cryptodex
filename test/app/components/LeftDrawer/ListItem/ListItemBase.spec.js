import ReactDOMServer from 'react-dom/server';
import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';
import sinon from 'sinon';
import React from 'react';

import ListItemBase from 'components/LeftDrawer/ListItem/ListItemBase';

import {
  diveForComponent,
  componentTemplate
} from 'test/utils';

const textSelector = 'WithStyles(ListItemText)';
const listItemIconSelector = 'WithStyles(ListItemIcon)';
const iconSelector = 'WithStyles(Icon)';
const secondaryActionSelector = 'WithStyles(ListItemSecondaryAction)';

const shallow = createShallow();

const setup = componentTemplate({
  component: ListItemBase,
  props: {
    icon: 'ICON',
    text: 'TEXT',
    onClick: sinon.spy(),
  },
  outputFn: output => shallow(output)
});

describe('ListItemBase component', () => {
  it('should render correctly', () => {
    const { output } = setup();
    expect(output.dive().dive().name()).to.equal('MenuItem');
  });

  it('should render passed text', () => {
    const { output, props } = setup();

    const listItemText = output.dive().find(textSelector);

    expect(
      listItemText.prop('primary')
    ).to.equal(
      props.text
    );
  });

  it('should render passed icon', () => {
    const { output, props } = setup();

    const icon = output.dive().find(iconSelector);

    expect(
      icon.children().text()
    ).to.equal(
      props.icon
    );
  });

  it('should respond to passed onClick event', () => {
    const { output, props } = setup();

    output.at(0).simulate('click');

    expect(
      props.onClick.calledOnce
    ).to.equal(
      true
    );
  });

  it('should pass additional menu item props', () => {
    const { output } = setup({
      props: {
        menuItemProps: {
          foo: 'bar'
        }
      }
    });

    const menuItem = diveForComponent(output, 'MenuItem');

    expect(
      menuItem.prop('foo')
    ).to.equal(
      'bar'
    );
  });

  it('should pass additional list item icon props', () => {
    const { output } = setup({
      props: {
        listItemIconProps: {
          foo: 'bar'
        }
      }
    });

    const listItemIcon = output.dive().find(listItemIconSelector);

    expect(
      listItemIcon.prop('foo')
    ).to.equal(
      'bar'
    );
  });

  it('should pass additional list item text props', () => {
    const { output } = setup({
      props: {
        listItemTextProps: {
          foo: 'bar'
        }
      }
    });

    const listItemText = output.dive().find(textSelector);

    expect(
      listItemText.prop('foo')
    ).to.equal(
      'bar'
    );
  });

  it('should display secondary action', () => {
    const { output, props } = setup({
      props: {
        secondaryAction: (
          <p>Foobar</p>
        )
      }
    });

    const secondaryAction = output.dive().find(secondaryActionSelector);

    expect(
      secondaryAction.children().at(0).html()
    ).to.equal(
      ReactDOMServer.renderToStaticMarkup(props.secondaryAction)
    );
  });
});
