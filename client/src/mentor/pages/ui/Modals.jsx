import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

const Modals = () => {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [showScrollableModal, setShowScrollableModal] = useState(false);
  const [showCenteredModal, setShowCenteredModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Modals</h1>
      </div>

      {/* Basic Modal Examples */}
      <Card title="Modal Examples" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Modals are dialog boxes/popups that are displayed on top of the current page.
            They're useful for displaying notifications, gathering user input, or showing additional content
            without navigating away from the current page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="primary" 
            onClick={() => setShowBasicModal(true)}
          >
            Basic Modal
          </Button>

          <Button 
            variant="info" 
            onClick={() => setShowLargeModal(true)}
          >
            Large Modal
          </Button>

          <Button 
            variant="success" 
            onClick={() => setShowSmallModal(true)}
          >
            Small Modal
          </Button>

          <Button 
            variant="warning" 
            onClick={() => setShowScrollableModal(true)}
          >
            Scrollable Modal
          </Button>

          <Button 
            variant="danger" 
            onClick={() => setShowCenteredModal(true)}
          >
            Vertically Centered
          </Button>

          <Button 
            variant="secondary" 
            onClick={() => setShowFormModal(true)}
          >
            Form Modal
          </Button>

          <Button 
            variant="danger" 
            onClick={() => setShowConfirmModal(true)}
          >
            Confirmation Modal
          </Button>
        </div>
      </Card>

      {/* Basic Modal */}
      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal"
        footer={
          <>
            <Button variant="light" onClick={() => setShowBasicModal(false)} className="mr-2">
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowBasicModal(false)}>
              Save changes
            </Button>
          </>
        }
      >
        <p>
          This is a basic modal with a header, content area, and footer with action buttons.
          It's the most common type of modal used in web applications.
        </p>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={showLargeModal}
        onClose={() => setShowLargeModal(false)}
        title="Large Modal"
        size="lg"
        footer={
          <>
            <Button variant="light" onClick={() => setShowLargeModal(false)} className="mr-2">
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowLargeModal(false)}>
              Save changes
            </Button>
          </>
        }
      >
        <p>
          This is a large modal that provides more space for content.
          Use large modals when you need to display more information or complex forms.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">Example Content</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
            rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
          </p>
        </div>
      </Modal>

      {/* Small Modal */}
      <Modal
        isOpen={showSmallModal}
        onClose={() => setShowSmallModal(false)}
        title="Small Modal"
        size="sm"
        footer={
          <Button variant="primary" onClick={() => setShowSmallModal(false)} block>
            Close
          </Button>
        }
      >
        <p>
          This is a small modal that's perfect for simple messages, alerts,
          or quick actions that don't require much space.
        </p>
      </Modal>

      {/* Scrollable Modal */}
      <Modal
        isOpen={showScrollableModal}
        onClose={() => setShowScrollableModal(false)}
        title="Scrollable Modal"
        scrollable
        footer={
          <>
            <Button variant="light" onClick={() => setShowScrollableModal(false)} className="mr-2">
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowScrollableModal(false)}>
              Save changes
            </Button>
          </>
        }
      >
        <div>
          <p className="mb-4">This modal has a scrollable body for handling large amounts of content:</p>
          
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h4 className="font-medium mb-2">Section {index + 1}</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
                rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
              </p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Centered Modal */}
      <Modal
        isOpen={showCenteredModal}
        onClose={() => setShowCenteredModal(false)}
        title="Vertically Centered Modal"
        centered
        footer={
          <>
            <Button variant="light" onClick={() => setShowCenteredModal(false)} className="mr-2">
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowCenteredModal(false)}>
              Save changes
            </Button>
          </>
        }
      >
        <p>
          This modal is vertically centered in the viewport, which can be
          useful for important messages or actions that need to grab the user's attention.
        </p>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Form Modal"
        footer={
          <>
            <Button variant="light" onClick={() => setShowFormModal(false)} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowFormModal(false)}>
              Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setShowConfirmModal(false)} className="mr-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setShowConfirmModal(false)}>
              Delete
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <i className="fas fa-exclamation-triangle text-red-600"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Item</h3>
          <p className="text-gray-500">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Modals;
