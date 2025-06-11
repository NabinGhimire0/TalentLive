import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Alert from '../../ui/Alert';

const Alerts = () => {
  const [showDismissibleAlerts, setShowDismissibleAlerts] = useState({
    primary: true,
    success: true,
    warning: true,
    danger: true,
    info: true,
  });

  const resetAlerts = () => {
    setShowDismissibleAlerts({
      primary: true,
      success: true,
      warning: true,
      danger: true,
      info: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
      </div>
      
      {/* Basic Alerts */}
      <Card title="Basic Alerts" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Alerts are used to provide contextual feedback messages for typical user actions.
            Use different colors to indicate different types of alerts.
          </p>
        </div>
        
        <div className="space-y-4">
          <Alert
            variant="primary"
            title="Primary Alert"
            message="This is a primary alert — check it out!"
          />
          
          <Alert
            variant="success"
            title="Success Alert"
            message="This is a success alert — check it out!"
          />
          
          <Alert
            variant="warning"
            title="Warning Alert"
            message="This is a warning alert — check it out!"
          />
          
          <Alert
            variant="danger"
            title="Danger Alert"
            message="This is a danger alert — check it out!"
          />
          
          <Alert
            variant="info"
            title="Info Alert"
            message="This is an info alert — check it out!"
          />
        </div>
      </Card>
      
      {/* Dismissible Alerts */}
      <Card title="Dismissible Alerts" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Add the dismissible prop to allow users to close the alert.
            Once closed, you'll need to set state to show it again.
          </p>
          
          <Button 
            variant="primary" 
            size="sm" 
            className="mt-2"
            onClick={resetAlerts}
          >
            Reset Alerts
          </Button>
        </div>
        
        <div className="space-y-4">
          {showDismissibleAlerts.primary && (
            <Alert
              variant="primary"
              title="Primary Alert"
              message="This is a dismissible primary alert."
              dismissible
              onDismiss={() => setShowDismissibleAlerts({...showDismissibleAlerts, primary: false})}
            />
          )}
          
          {showDismissibleAlerts.success && (
            <Alert
              variant="success"
              title="Success Alert"
              message="This is a dismissible success alert."
              dismissible
              onDismiss={() => setShowDismissibleAlerts({...showDismissibleAlerts, success: false})}
            />
          )}
          
          {showDismissibleAlerts.warning && (
            <Alert
              variant="warning"
              title="Warning Alert"
              message="This is a dismissible warning alert."
              dismissible
              onDismiss={() => setShowDismissibleAlerts({...showDismissibleAlerts, warning: false})}
            />
          )}
          
          {showDismissibleAlerts.danger && (
            <Alert
              variant="danger"
              title="Danger Alert"
              message="This is a dismissible danger alert."
              dismissible
              onDismiss={() => setShowDismissibleAlerts({...showDismissibleAlerts, danger: false})}
            />
          )}
          
          {showDismissibleAlerts.info && (
            <Alert
              variant="info"
              title="Info Alert"
              message="This is a dismissible info alert."
              dismissible
              onDismiss={() => setShowDismissibleAlerts({...showDismissibleAlerts, info: false})}
            />
          )}
        </div>
      </Card>
      
      {/* Alerts with Custom Icons */}
      <Card title="Alerts with Custom Icons" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            You can customize the icon displayed in the alert to better convey the message.
          </p>
        </div>
        
        <div className="space-y-4">
          <Alert
            variant="primary"
            title="Custom Icon"
            message="This alert uses a custom bell icon."
            icon="fas fa-bell"
          />
          
          <Alert
            variant="success"
            title="Payment Successful"
            message="Your payment has been processed successfully."
            icon="fas fa-credit-card"
          />
          
          <Alert
            variant="warning"
            title="Subscription Ending"
            message="Your subscription will end in 7 days. Please renew to avoid service interruption."
            icon="fas fa-calendar-alt"
          />
          
          <Alert
            variant="danger"
            title="Account Locked"
            message="Your account has been locked due to multiple failed login attempts."
            icon="fas fa-lock"
          />
          
          <Alert
            variant="info"
            title="New Feature Available"
            message="We've just launched a new feature. Check it out in your dashboard."
            icon="fas fa-bullhorn"
          />
        </div>
      </Card>
      
      {/* Alert Content Variations */}
      <Card title="Alert Content Variations" collapsible>
        <div className="mb-4">
          <p className="text-gray-600">
            Alerts can contain different types of content to provide more context and actions.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Alert with title only */}
          <Alert
            variant="primary"
            title="This is an alert with only a title and no message."
          />
          
          {/* Alert with message only */}
          <Alert
            variant="info"
            message="This is an alert with only a message and no title."
          />
          
          {/* Alert with additional content */}
          <Alert
            variant="success"
            title="Account Created"
            message="Your account has been created successfully. You can now access all features of the platform."
          />
          
          {/* Alert with HTML content */}
          <Alert
            variant="warning"
            title="Please Note"
            message={
              <div>
                This alert contains <strong>formatted text</strong> and a{' '}
                <a href="#" className="underline text-blue-600 hover:text-blue-800">
                  link
                </a>{' '}
                that you can click.
              </div>
            }
          />
          
          {/* Alert with action buttons */}
          <Alert
            variant="danger"
            title="Delete Account"
            message={
              <div>
                <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex space-x-2">
                  <Button variant="light" size="sm">Cancel</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default Alerts;
