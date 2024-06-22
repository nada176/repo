import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewsEventsSection.css';

const NewsEventEntry = ({ date, title, content, imageSrc }) => {
  return (
    <div className="news-event-entry">
      {date && (
        <div className="news-event-date mb-2">
          <span className="news-event-day">{date.day}</span>
          <span className="news-event-month">{date.month}</span>
        </div>
      )}
      {imageSrc && (
        <img src={imageSrc} alt={title} className="news-event-image mb-3 img-fluid" />
      )}
      <div className="news-event-text-content">
        <h3 className="news-event-title mb-2">{title}</h3>
        <p className="news-event-text">{content}</p>
        <a href="#readmore" className="btn btn-primary mt-3">
          READ MORE
        </a>
      </div>
    </div>
  );
};

const NewsEventsSection = () => {
  return (
    <div className="news-events-section">
      <div className="row">
        <div className="col-md-8 news-events-left">
          {/* This will render the left side entries */}
          {/* Repeat NewsEventEntry for as many entries as you have */}
          <NewsEventEntry
            date={{ day: '30', month: 'DEC' }}
            title="DOLOERTAS MIASE NYRAS"
            content="Delaomert yasemosera secaaratia keses aestrsego etayse laitsrdesa ernatur autdiutat."
          />
           <NewsEventEntry
            date={{ day: '30', month: 'DEC' }}
            title="DOLOERTAS MIASE NYRAS"
            content="Delaomert yasemosera secaaratia keses aestrsego etayse laitsrdesa ernatur autdiutat."
          />
           <NewsEventEntry
            date={{ day: '30', month: 'DEC' }}
            title="DOLOERTAS MIASE NYRAS"
            content="Delaomert yasemosera secaaratia keses aestrsego etayse laitsrdesa ernatur autdiutat."
          />
          {/* ...other entries */}
        </div>
        <div className="col-md-4 news-events-right">
          {/* This will render the right side entries with images */}
          <NewsEventEntry
            imageSrc="../../assets/images/hero-1.jpg" // Replace with actual image path
            title="DIAGNOSING UNIQUE PROBLEMS & ORAL SURGERY"
          />
            <NewsEventEntry
            imageSrc="../../assets/images/hero-1.jpg" // Replace with actual image path
            title="DIAGNOSING UNIQUE PROBLEMS & ORAL SURGERY"
          />
          {/* ...other entry */}
        </div>
      </div>
    </div>
  );
};

export default NewsEventsSection;
