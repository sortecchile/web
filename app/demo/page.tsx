import React from 'react';

const VideoPage = () => {
  return (
    <div className="container px-2 md:px-6">
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
          src="https://www.tella.tv/video/cm2nrgrjk000003l0csmid62g/embed?b=1&title=0&a=1&loop=0&t=0&muted=0&wt=1"
          allowFullScreen
          allowTransparency
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPage;
