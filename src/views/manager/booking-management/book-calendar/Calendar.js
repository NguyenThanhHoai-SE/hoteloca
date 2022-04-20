import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  AllDayPanel,
  AppointmentForm, Appointments, DateNavigator, MonthView, Scheduler, TodayButton, Toolbar, ViewSwitcher
} from "@devexpress/dx-react-scheduler-material-ui";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Paper from "@mui/material/Paper";
import { alpha, darken, lighten, styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import classNames from "clsx";
import moment from "moment";
import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { loadFromLocalStorage, updateDateForTaskToLocalStorage } from "actions/localStorage";
import { editDateOfTask, selectTaskByTime, setTasks } from "reducers/booking.reducer";
import Task from "./Task/index";
// import useWindowScrollPositions from "../HOC/useWindowScrollPositions";
import withScrollHook from "../withScrollHook";
import AddTaskDrawer from "./AddTask/AddTaskDrawer";
import { owners } from "./task";


const PREFIX = "Demo";

const classes = {
  cell: `${PREFIX}-cell`,
  content: `${PREFIX}-content`,
  text: `${PREFIX}-text`,
  todayText: `${PREFIX}-todayText`,
  sun: `${PREFIX}-sun`,
  cloud: `${PREFIX}-cloud`,
  rain: `${PREFIX}-rain`,
  sunBack: `${PREFIX}-sunBack`,
  cloudBack: `${PREFIX}-cloudBack`,
  rainBack: `${PREFIX}-rainBack`,
  opacity: `${PREFIX}-opacity`,
  appointment: `${PREFIX}-appointment`,
  apptContent: `${PREFIX}-apptContent`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
  tooltipContent: `${PREFIX}-tooltipContent`,
  tooltipText: `${PREFIX}-tooltipText`,
  title: `${PREFIX}-title`,
  icon: `${PREFIX}-icon`,
  circle: `${PREFIX}-circle`,
  textCenter: `${PREFIX}-textCenter`,
  dateAndTitle: `${PREFIX}-dateAndTitle`,
  titleContainer: `${PREFIX}-titleContainer`,
  container: `${PREFIX}-container`,
  scrollTopIcon: `${PREFIX}-scrollTop`,
};

const getBorder = (theme) =>
  `1px solid ${theme.palette.mode === "light"
    ? lighten(alpha(theme.palette.divider, 1), 0.88)
    : darken(alpha(theme.palette.divider, 1), 0.68)
  }`;

const DayScaleCell = (props) => (
  <MonthView.DayScaleCell
    {...props}
    style={{
      textAlign: "left",
      fontWeight: "bold",
      textTransform: "uppercase",
    }}
  />
);

// #FOLD_BLOCK
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.cell}`]: {
    // color: "#78909C!important",
    color: "#000 !important",
    backgroundColor: "#fff !important",
    position: "relative",
    userSelect: "none",
    verticalAlign: "top",
    padding: 0,
    // height: 100,
    borderLeft: getBorder(theme),
    "&:first-of-type": {
      borderLeft: "none",
    },
    "&:last-child": {
      paddingRight: 0,
    },
    "tr:last-child &": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: "white",
    },
    "&:focus": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      outline: 0,
    },
  },
  [`&.${classes.sunBack}`]: {
    backgroundColor: "#FFFDE7",
  },
  [`&.${classes.cloudBack}`]: {
    backgroundColor: "#ECEFF1",
  },
  [`&.${classes.rainBack}`]: {
    backgroundColor: "#E1F5FE",
  },
  [`&.${classes.opacity}`]: {
    opacity: "0.5",
  },
}));

// #FOLD_BLOCK
const StyledDivText = styled("div")(() => ({
  [`&.${classes.text}`]: {
    padding: "0.5em",
    textAlign: "left",
    "& > .task-text": {
      maxHeight: 60,
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        // display: "none",
        width: "6px",
        backgroundColor: "#F5F5F5"
      },
    },
  },
  [`&.${classes.todayText}`]: {
    "& > span": {
      color: "blue",
      fontWeight: "600",
    },
  },
}));

// #FOLD_BLOCK
const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderRadius: "10px",
    "&:hover": {
      opacity: 0.6,
    },
  },
}));

// #FOLD_BLOCK
const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    flex: "none",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
  },
}));

// #FOLD_BLOCK
const StyledAppointmentsAppointmentContent = styled(
  Appointments.AppointmentContent
)(() => ({
  [`&.${classes.apptContent}`]: {
    "&>div>div": {
      whiteSpace: "normal !important",
      lineHeight: 1.2,
    },
  },
}));

const StyledScrollIcon = styled("div")(() => ({
  [`&.${classes.scrollTopIcon}`]: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "rgba(153, 206, 241, 0.8)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: "50%",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(153, 206, 241, 1)",
    },
  },
}));

const appointments = [
  {
    id: 0,
    title: "Watercolor Landscape",
    startDate: new Date(2022, 3, 23, 9, 30),
    endDate: new Date(2022, 3, 23, 11, 30),
    ownerId: 1,
  },
];


// #FOLD_BLOCK
const CellBase = React.memo(
  ({
    startDate,
    formatDate,
    otherMonth,
    handleStateForm,
    handleDateChoice,
    // #FOLD_BLOCK
  }) => {
    const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 3);
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
      ? { day: "numeric", month: "long" }
      : { day: "numeric" };

    const tasksOfDay = useSelector(selectTaskByTime(startDate));

    React.useEffect(() => {
    });

    const handleOpenDrawer = () => {
      handleStateForm(true)
      handleDateChoice(startDate);
      // alert(startDate)
    }

    return (
      <StyledTableCell
        onDoubleClick={handleOpenDrawer}
        tabIndex={0}
        className={classNames({
          [classes.cell]: true,
          [classes.rainBack]: iconId === 0,
          [classes.sunBack]: iconId === 1,
          [classes.cloudBack]: iconId === 2,
          [classes.opacity]: otherMonth,
        })}
      >
        <StyledDivText
          className={classNames({
            [classes.text]: true,
            [classes.todayText]:
              moment(startDate).format("YYYY-MM-DD") ==
              moment().format("YYYY-MM-DD"),
          })}
        >
          <span>{formatDate(startDate, formatOptions)}</span>
          {/* <DragDropContext> */}
          {/* <Droppable droppableId={startDate.toString()}> */}
          <Droppable droppableId={startDate.toString()}>
            {(provided) => (
              <div
                className="task-text"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasksOfDay.length === 0 && (
                  <Draggable key={uuid()} draggableId={uuid()} index={0}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div style={{ color: "#fff", cursor: "default", padding: '10px 0' }}>
                          .
                        </div>
                      </div>
                    )}
                  </Draggable>
                )}
                {tasksOfDay.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        // key={task.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Task task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* </DragDropContext> */}

          {/* </div> */}
        </StyledDivText>
      </StyledTableCell>
    );
  }
);


// const Appointment = ({ ...restProps }) => (
//   <StyledAppointmentsAppointment
//     {...restProps}
//     className={classes.appointment}
//   />
// );

// const AppointmentContent = ({ ...restProps }) => (
//   <StyledAppointmentsAppointmentContent
//     {...restProps}
//     className={classes.apptContent}
//   />
// );

const FlexibleSpace = ({ ...restProps }) => (
  <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
  </StyledToolbarFlexibleSpace>
);

class Calendar extends React.PureComponent {
  // #FOLD_BLOCK
  constructor(props) {
    super(props);

    this.state = {
      // data: appointments,
      stateForm: false,
      dateChoice: null,
    };

    // this.commitChanges = this.commitChanges.bind(this);
  }

  // #FOLD_BLOCK
  // commitChanges({ added, changed, deleted }) {
  //   this.setState((state) => {
  //     let { data } = state;
  //     if (added) {
  //       const startingAddedId =
  //         data.length > 0 ? data[data.length - 1].id + 1 : 0;
  //       data = [...data, { id: startingAddedId, ...added }];
  //     }
  //     if (changed) {
  //       data = data.map((appointment) =>
  //         changed[appointment.id]
  //           ? { ...appointment, ...changed[appointment.id] }
  //           : appointment
  //       );
  //     }
  //     if (deleted !== undefined) {
  //       data = data.filter((appointment) => appointment.id !== deleted);
  //     }
  //     return { data };
  //   });
  // }

  onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    this.props.editDateOfTask({
      id: draggableId,
      newTime: moment(destination.droppableId),
    });
    updateDateForTaskToLocalStorage(draggableId, moment(destination.droppableId));
  };

  componentDidMount() {
    // load tasks from the local storage and save to Redux
    const data = loadFromLocalStorage();
    this.props.setTasks(data);
  }

  handleStateForm = (state) => {
    this.setState({ stateForm: state });
  }

  handleDateChoice = (date) => {
    this.setState({ dateChoice: date });
  }

  render() {
    // const { data } = this.state;

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Paper>
            <Scheduler>
              {/* <EditingState onCommitChanges={this.commitChanges} /> */}
              <ViewState defaultCurrentDate={moment().format("YYYY-MM-DD")} />

              {/* <DragDropContext> */}
              <MonthView
                messages={{
                  allDay: 'Ganztägig',
                }}
                timeTableCellComponent={(props) =>
                  <CellBase
                    handleStateForm={this.handleStateForm}
                    handleDateChoice={this.handleDateChoice}
                    {...props} />}
                dayScaleCellComponent={DayScaleCell}
              />
              {/* </DragDropContext> */}

              {/* <Appointments
              appointmentComponent={Appointment}
              appointmentContentComponent={AppointmentContent}
            /> */}
              {/* <Resources data={resources} /> */}
              <Toolbar flexibleSpaceComponent={FlexibleSpace} />
              <DateNavigator />
              <TodayButton messages={{
                today: "Hôm nay"
              }} />
              <ViewSwitcher />
              <Appointments />
              <AllDayPanel
                messages={{
                  allDay: 'Ganztägig',
                }}
              />
              {/* <EditRecurrenceMenu /> */}
              {/* <AppointmentTooltip
              showCloseButton
              showDeleteButton
              showOpenButton
            /> */}
              <AppointmentForm />
              {/* <DragDropProvider /> */}
            </Scheduler>

            <StyledScrollIcon
              className={classes.scrollTopIcon}
              style={{
                display:
                  this.props.scrollPosition.scrollY === 0 ? "none" : "flex",
              }}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                console.log(this.props.scrollPosition);
              }}
            >
              <ArrowDropUpIcon />
            </StyledScrollIcon>
          </Paper>
        </DragDropContext>

        <AddTaskDrawer
          stateForm={this.state.stateForm}
          handleStateForm={this.handleStateForm}
          dateChoice={this.state.dateChoice} />
      </div>
    );
  }
}

// export default Calendar;
const mapStateToProps = (state) => ({
  // count: state.counter.value
});

const mapDispatchToProps = { editDateOfTask, setTasks };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withScrollHook(Calendar));