import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const items = [
  { id: uuid(), content: "In Progress" },
  { id: uuid(), content: "Rewarded" },
];
const items2 = [
  { id: uuid(), content: "Under Review" },
  { id: uuid(), content: "Rewarded" },
  { id: uuid(), content: "In Progress" },
];

const title = {
  [uuid()]: {
    name: "open bounties",
    items: items,
  },
  [uuid()]: {
    name: "assigned/in progress",
    items: items2,
  },
  [uuid()]: {
    name: "under review",
    items: [],
  },
  [uuid()]: {
    name: "close / rewarded",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(title);
  return (
    <div className="w-full min-h-screen px-5 py-16 mx-auto max-w-7xl">
      <div className="flex justify-center w-full py-10 overflow-x-auto ">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="flex flex-col items-center " key={columnId}>
                <h2 className="w-full font-extrabold text-center uppercase">
                  {column.name}
                </h2>
                <div className="m-4">
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`${
                            snapshot.isDraggingOver
                              ? "bg-slate-300"
                              : "bg-slate-100"
                          } p-6 w-[250px] min-h-[500px] `}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`${
                                        snapshot.isDragging
                                          ? "bg-gray-800"
                                          : "bg-gray-500"
                                      } p-4 text-white mb-4 rounded-md `}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
