import React, { useState, useEffect } from "react";
import KanbanCard from "./KanbanCard";
import { useHistory, useLocation } from "react-router-dom";
import "./style.css"; 
import DisplayIcon from "../icons_FEtask.svg/Display";
import DownIcon from "../icons_FEtask.svg/down";
import NoPriorityIcon from "../icons_FEtask.svg/NoPriority";
import UrgentPriorityColorIcon from "../icons_FEtask.svg/UrgentPriorityColour";
import HighPriorityIcon from "../icons_FEtask.svg/HighPriority";
import MediumPriorityIcon from "../icons_FEtask.svg/MediumPriority";
import LowPriorityIcon from "../icons_FEtask.svg/LowPriority";
import BacklogIcon from "../icons_FEtask.svg/Backlog";
import TodoIcon from "../icons_FEtask.svg/Todo";
import InProgressIcon from "../icons_FEtask.svg/InProgress";
import DoneIcon from "../icons_FEtask.svg/Done";
import CancelledIcon from "../icons_FEtask.svg/Cancelled";
import AddIcon from "../icons_FEtask.svg/add";
import DotIcon from "../icons_FEtask.svg/DotMenu";

const groupingOptions = [
  { key: "status", value: "status", text: "Status" },
  { key: "priority", value: "priority", text: "Priority" },
  { key: "assignee", value: "assignee", text: "Assignee" },
];

const orderingOptions = [
  { key: "priority", value: "priority", text: "Priority" },
  { key: "title", value: "title", text: "Title" },
];

const priorityLabels = ["No priority", "Urgent", "High", "Medium", "Low"];
const statusOrder = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [display, setDisplay] = useState(false);

  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // On initial load, set grouping and ordering from query parameters
    const queryParams = new URLSearchParams(location.search);
    const initialGrouping = queryParams.get("grouping") || "status";
    const initialOrdering = queryParams.get("ordering") || "priority";
    setGrouping(initialGrouping);
    setOrdering(initialOrdering);
  }, [location.search]);

  const updateURL = (newGrouping, newOrdering) => {
    const queryParams = new URLSearchParams();
    queryParams.set("grouping", newGrouping);
    queryParams.set("ordering", newOrdering);
    history.push({ search: queryParams.toString() });
  };

  const handleGroupingChange = (e) => {
    const newGrouping = e.target.value;
    setGrouping(newGrouping);
    updateURL(newGrouping, ordering);
  };

  const handleOrderingChange = (e) => {
    const newOrdering = e.target.value;
    setOrdering(newOrdering);
    updateURL(grouping, newOrdering);
  };

  const getSortedTickets = (tickets, ordering) => {
    return [...tickets].sort((a, b) => {
      if (ordering === "priority") {
        return a.priority - b.priority;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  const getUserImg = (userId) => {
    // I am unable to find user icon in file, so using this image..
    return "https://react.semantic-ui.com/images/avatar/large/jenny.jpg";
  };

  const groupTickets = (tickets, grouping) => {
    return tickets.reduce((groups, ticket) => {
      let groupKey;
      if (grouping === "assignee") {
        groupKey = getUserName(ticket.userId);
      } else if (grouping === "priority") {
        groupKey = ticket.priority; // Group by numeric priority
      } else {
        groupKey = ticket[grouping];
      }
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(ticket);
      return groups;
    }, {});
  };

  const groupedTickets = groupTickets(tickets, grouping);
  const sortedGroupedTickets = [];

  if (grouping === "status") {
    statusOrder.forEach((status) => {
      sortedGroupedTickets.push({
        key: status,
        tickets: getSortedTickets(groupedTickets[status] || [], ordering),
      });
    });
  } else {
    Object.entries(groupedTickets).forEach(([key, group]) => {
      sortedGroupedTickets.push({
        key: grouping === "priority" ? priorityLabels[key] : key,
        tickets: getSortedTickets(group, ordering),
      });
    });
  }

  if (loading) {
    return <div className="loader">Loading Tasks...</div>;
  }

  return (
    <div className="kanban-board">
      <button className="button" onClick={() => setDisplay((prev) => !prev)}>
        <div style={{ alignItems: "center", display: "flex" }}>
          <DisplayIcon />
          <label style={{ padding: "5px" }}>Display</label>
          <DownIcon />
        </div>
      </button>
      <hr class="custom-line" />
      <div className="menu">
        {display && (
          <div className="menu-item">
            <div className="label">
              <label style={{ alignContent: "center" }}>
                <strong className="labelText">Grouping</strong>
              </label>
              <select
                style={{ width: "120px" }}
                value={grouping}
                onChange={handleGroupingChange}
              >
                {groupingOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="label">
              <label style={{ alignContent: "center" }}>
                <strong className="labelText">Ordering</strong>
              </label>
              <select
                style={{ width: "120px", marginLeft: "5px" }}
                value={ordering}
                onChange={handleOrderingChange}
              >
                {orderingOptions.map((option) => (
                  <option key={option.key} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid">
        {sortedGroupedTickets.map((group) => (
          <div className="grid-column" key={group.key}>
            <div className="group-header">
              <h3>
                {group.key === "No priority" && <NoPriorityIcon />}
                {group.key === "Urgent" && <UrgentPriorityColorIcon />}
                {group.key === "High" && <HighPriorityIcon />}
                {group.key === "Medium" && <MediumPriorityIcon />}
                {group.key === "Low" && <LowPriorityIcon />}
                {group.key === "Backlog" && <BacklogIcon />}
                {group.key === "Todo" && <TodoIcon />}
                {group.key === "In progress" && <InProgressIcon />}
                {group.key === "Done" && <DoneIcon />}
                {group.key === "Cancelled" && <CancelledIcon />} {group.key}{" "}
                {sortedGroupedTickets.map(
                  (data) => data?.key === group.key && data?.tickets.length
                )}
              </h3>
              <div className="group-icons">
                <span className="icon">
                  <AddIcon />
                </span>{" "}
                <span className="icon">
                  {" "}
                  <DotIcon />
                </span>{" "}
              </div>
            </div>
            {group.tickets.length > 0 ? (
              group.tickets.map((ticket) => (
                <KanbanCard
                  ticket={ticket}
                  userImg={getUserImg(ticket.userId)}
                  key={ticket.id}
                />
              ))
            ) : (
              <div className="empty-state">No tickets available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
