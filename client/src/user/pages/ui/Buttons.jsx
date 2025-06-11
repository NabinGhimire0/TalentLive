import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const Buttons = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Buttons</h1>
      </div>
      
      {/* Button Variants */}
      <Card title="Button Variants" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Use button variants to indicate different actions and priorities.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="light">Light</Button>
          <Button variant="dark">Dark</Button>
        </div>
      </Card>
      
      {/* Outline Buttons */}
      <Card title="Outline Buttons" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Use outline buttons for a more subtle look, while still maintaining the semantic meaning.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" outline>Primary</Button>
          <Button variant="secondary" outline>Secondary</Button>
          <Button variant="success" outline>Success</Button>
          <Button variant="danger" outline>Danger</Button>
          <Button variant="warning" outline>Warning</Button>
          <Button variant="info" outline>Info</Button>
          <Button variant="light" outline>Light</Button>
          <Button variant="dark" outline>Dark</Button>
        </div>
      </Card>
      
      {/* Button Sizes */}
      <Card title="Button Sizes" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Use different button sizes for different contexts.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary">Default</Button>
          <Button variant="primary" size="sm">Small</Button>
        </div>
      </Card>
      
      {/* Buttons with Icons */}
      <Card title="Buttons with Icons" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Add icons to buttons to enhance visual cues.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" icon="fas fa-plus">Add Item</Button>
          <Button variant="success" icon="fas fa-check">Save</Button>
          <Button variant="danger" icon="fas fa-trash">Delete</Button>
          <Button variant="info" icon="fas fa-sync">Refresh</Button>
          <Button variant="warning" icon="fas fa-edit">Edit</Button>
          <Button variant="secondary" icon="fas fa-download">Download</Button>
          <Button variant="primary" iconPosition="right" icon="fas fa-arrow-right">Next</Button>
        </div>
      </Card>
      
      {/* Block Buttons */}
      <Card title="Block Buttons" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Block buttons span the full width of the parent element.
          </p>
        </div>
        
        <div className="space-y-2">
          <Button variant="primary" block>Block Button</Button>
          <Button variant="secondary" block>Block Button</Button>
          <Button variant="success" block>Block Button</Button>
        </div>
      </Card>
      
      {/* Rounded Buttons */}
      <Card title="Rounded Buttons" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Rounded buttons have a pill-like appearance.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" rounded>Rounded</Button>
          <Button variant="secondary" rounded>Rounded</Button>
          <Button variant="success" rounded>Rounded</Button>
          <Button variant="danger" rounded>Rounded</Button>
          <Button variant="warning" rounded>Rounded</Button>
        </div>
      </Card>
      
      {/* Button States */}
      <Card title="Button States" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Buttons can be shown in different states: normal, disabled, and loading.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
      </Card>
    </div>
  );
};

export default Buttons;
