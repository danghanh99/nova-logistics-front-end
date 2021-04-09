import { TheContent, TheSidebar, TheFooter, TheHeader } from './index';
import { Redirect } from 'react-router-dom';
const TheLayout = () => {
  return (
    <>
      <div className="c-app c-default-layout">
        <TheSidebar />
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <TheContent />
          </div>
          <TheFooter />
        </div>
      </div>
      <Redirect from="/" to="/admin/exports" />
    </>
  );
};

export default TheLayout;
