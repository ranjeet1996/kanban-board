import React from "react";
import "./kanbanCardStyles.css"; 

const KanbanCard = ({ ticket, userImg }) => (
  <div className="kanban-card" key={ticket.id}>
    <div className="kanban-card-content">
      <div className="ticket-meta">
        <span className="ticket-id">{ticket.id}</span>
        <h4 className="ticket-title">{ticket.title}</h4>
      </div>
      <img className="user-image" src={userImg} alt="User" />
      <span className="ticket-icon">
        <i className="icon-ellipsis"></i>
      </span>
    </div>
    <div className="ticket-tags">
      {ticket.tag.map((item, index) => (
        <span key={index} className="ticket-tag">
          <span className="dot" />
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default KanbanCard;
