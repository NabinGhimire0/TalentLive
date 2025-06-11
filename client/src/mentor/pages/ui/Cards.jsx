import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const Cards = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Cards</h1>
      </div>
      
      {/* Card Variants */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Card Variants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Default Card" collapsible closable>
          <p className="text-gray-600">
            This is a default card with collapsible and closable options.
            You can click the icons in the top right to collapse or close this card.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm">Action</Button>
          </div>
        </Card>
        
        <Card title="Primary Card" variant="primary" collapsible closable>
          <p className="text-gray-600">
            This is a primary card with a colored header.
            It also has collapsible and closable functionality.
          </p>
          <div className="mt-4">
            <Button variant="light" size="sm">Action</Button>
          </div>
        </Card>
        
        <Card title="Success Card" variant="success" collapsible closable>
          <p className="text-gray-600">
            This is a success card with a colored header.
            It also has collapsible and closable functionality.
          </p>
          <div className="mt-4">
            <Button variant="light" size="sm">Action</Button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Info Card" variant="info" collapsible closable>
          <p className="text-gray-600">
            This is an info card with a colored header.
            It also has collapsible and closable functionality.
          </p>
          <div className="mt-4">
            <Button variant="light" size="sm">Action</Button>
          </div>
        </Card>
        
        <Card title="Warning Card" variant="warning" collapsible closable>
          <p className="text-gray-600">
            This is a warning card with a colored header.
            It also has collapsible and closable functionality.
          </p>
          <div className="mt-4">
            <Button variant="light" size="sm">Action</Button>
          </div>
        </Card>
        
        <Card title="Danger Card" variant="danger" collapsible closable>
          <p className="text-gray-600">
            This is a danger card with a colored header.
            It also has collapsible and closable functionality.
          </p>
          <div className="mt-4">
            <Button variant="light" size="sm">Action</Button>
          </div>
        </Card>
      </div>
      
      {/* Card with Footer */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Cards with Footer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          title="Card with Footer" 
          footer={
            <div className="flex justify-end">
              <Button variant="light" className="mr-2">Cancel</Button>
              <Button variant="primary">Save</Button>
            </div>
          }
        >
          <p className="text-gray-600">
            This card has a footer section with action buttons.
            Footers are useful for placing actions related to the card content.
          </p>
        </Card>
        
        <Card 
          title="Card with Custom Footer" 
          variant="primary"
          footer={
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Last updated 3 mins ago</div>
              <Button variant="light" size="sm">View Details</Button>
            </div>
          }
        >
          <p className="text-gray-600">
            This card has a custom footer with informational text and an action button.
            You can put any content in the footer section.
          </p>
        </Card>
      </div>
      
      {/* Content Cards */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Content Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <img src="https://via.placeholder.com/300x150" alt="Card image" className="w-full h-40 object-cover mb-4 rounded" />
          <h3 className="text-xl font-semibold mb-2">Card with Image</h3>
          <p className="text-gray-600 mb-4">
            This is a card with an image at the top.
            It's perfect for articles, blog posts, or product displays.
          </p>
          <Button variant="primary" block>Read More</Button>
        </Card>
        
        <Card>
          <div className="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-gray-500 text-sm">Software Engineer</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            "This is a testimonial card with a user profile picture.
            Great for showcasing customer reviews or team members."
          </p>
          <div className="text-yellow-500 flex">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
          </div>
        </Card>
        
        <Card>
          <div className="bg-blue-50 text-blue-600 p-4 mb-4 rounded flex items-center">
            <i className="fas fa-info-circle text-xl mr-3"></i>
            <div>
              <h3 className="font-medium">Did You Know?</h3>
              <p className="text-sm text-blue-500">Cards are versatile UI components.</p>
            </div>
          </div>
          <p className="text-gray-600">
            This card highlights important information with a special header section.
            It's useful for tips, notifications, or featured content.
          </p>
        </Card>
      </div>
      
      {/* Card Layouts */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Card Layouts</h2>
      <div className="space-y-6">
        <Card title="Horizontal Card Layout">
          <div className="flex flex-col md:flex-row">
            <img src="https://via.placeholder.com/200" alt="Card image" className="w-full md:w-40 h-40 object-cover rounded-t md:rounded-l md:rounded-t-none mb-4 md:mb-0 md:mr-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Horizontal Card</h3>
              <p className="text-gray-600 mb-4">
                This card uses a horizontal layout on larger screens, with the image on the left and content on the right.
                It's responsive and will stack vertically on smaller screens.
              </p>
              <Button variant="primary" size="sm">Learn More</Button>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <div className="flex items-center justify-center mb-4 h-16 w-16 bg-blue-100 text-blue-500 rounded-full mx-auto">
                <i className={`fas fa-${['chart-line', 'users', 'cog'][item-1]} text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Feature {item}</h3>
              <p className="text-gray-600 text-center">
                This is a feature card with a centered icon and text.
                Great for highlighting features or services.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
