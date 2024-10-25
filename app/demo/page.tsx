import React from 'react';

const Video2Page = () => {
  return (
    <div className="container px-2 md:px-6">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <iframe
          style={{ border: 0 }}
          width="800"
          height="450"
          src="https://www.tella.tv/video/cm2ow0qmm000803mq4ju91bq0/embed?b=1&title=0&a=1&loop=0&t=0&muted=0&wt=1"
          allowFullScreen
          allowTransparency
        ></iframe>
      </div>
    </div>
  );
};

export default Video2Page;
