import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import BookIcon from '@mui/icons-material/Book';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import SchoolIcon from '@mui/icons-material/School';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import TaskIcon from '@mui/icons-material/Task';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LockResetIcon from '@mui/icons-material/LockReset';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const sidebarConsts = {
    information: [
        {
            title: "Students",
            path: "/admin/students",
            icon: GroupIcon,
            roles: ["admin"],
        },
        {
            title: "Faculties",
            path: "/admin/faculties",
            icon: PersonOutlineIcon,
            roles: ["admin"],
        },
        {
            title: "Updates",
            path: "/admin/updates",
            icon: NotificationsIcon,
            roles: ["admin"],
        },
        {
            title: "Updates",
            path: "/faculty/updates",
            icon: NotificationsIcon,
            roles: ["faculty"],
        },
        {
            title: "Updates",
            path: "/student/updates",
            icon: NotificationsIcon,
            roles: ["student"],
        },
        {
            title: "Courses",
            path: "/admin/courses",
            icon: CollectionsBookmarkIcon,
            roles: ["admin"],
        },
        {
            title: "Classes",
            path: "/admin/classes",
            icon: SchoolIcon,
            roles: ["admin"],
        },
        {
            title: 'Calender',
            getPath: (user) => `/${user.role}/calender`,
            icon: CalendarMonthIcon,
            roles: ['student', 'faculty']
        },
        {
            title: "My Timetable",
            getPath: (user) => `/${user.role}/timetable`,
            icon: EventNoteIcon,
            roles: ['student', 'faculty']
        },
        {
            title: "Attendance",
            path: "/faculty/attendance",
            icon: CoPresentIcon,
            roles: ['faculty']
        },
        {
            title: "Students",
            path: '/faculty/class/students',
            icon: GroupsIcon,
            roles: ['faculty']
        },
        {
            title: "Marks",
            path: '/faculty/marks',
            icon: AssessmentIcon,
            roles: ['faculty']
        },
        {
            title: "Tasks",
            getPath: (user) => `/${user.role}/tasks`,
            icon: TaskIcon,
            roles: ['student', 'faculty']
        },
        {
            title: "Tests",
            getPath: (user) => `/${user.role}/tests`,
            icon: NoteAddIcon,
            roles: ['student', 'faculty']
        },
        {
            title: "Admit Card",
            path: "/student/exams",
            icon: PendingActionsIcon,
            roles: ['student']
        },
        {
            title: "Marksheet",
            path: "/student/marks",
            icon: CollectionsBookmarkIcon,
            roles: ['student']
        },
        {
            title: "Materials",
            getPath: (user) => `/${user.role}/materials`,
            icon: FolderCopyIcon,
            roles: ['student','faculty','admin']
        },
        {
            title: "Events",
            getPath: (user) => `/${user.role}/events`,
            icon: EmojiEventsIcon,
            roles: ['student','faculty','admin']
        },
    ],
    create: [
        {
            title: "Create Student",
            path: "/admin/students/new",
            icon: GroupAddIcon,
            roles:[ "admin"],
        },
        {
            title: "Create Faculty",
            path: "/admin/faculties/new",
            icon: PersonAddIcon,
            roles: ["admin"],
        },
        {
            title: "Create Update",
            path: "/admin/updates/new",
            icon: NotificationAddIcon,
            roles: ["admin"],
        },
        {
            title: "Create Update",
            path: "/faculty/updates/new",
            icon: NotificationAddIcon,
            roles: ["faculty"],
        },
        {
            title: "Create Course",
            path: "/admin/courses/new",
            icon: BookIcon,
            roles: ["admin"],
        },
        {
            title: "Create Timetable",
            path: "/admin/timetables/new",
            icon: ViewTimelineIcon,
            roles: ["admin"],
        },
        {
            title: "Add Exam Dates",
            path: "/admin/exams/dates",
            icon: PendingActionsIcon,
            roles: ["admin"]
        },
        {
            title: "Add Material",
            path: "/admin/materials/new",
            icon: CreateNewFolderIcon,
            roles: ["admin"]
        },
        {
            title: "Add Material",
            path: "/faculty/materials/new",
            icon: CreateNewFolderIcon,
            roles: ["faculty"]
        },
        {
            title: "Classes",
            path: "/admin/classes/new",
            icon: AddModeratorIcon,
            roles: ["admin"]
        },
        {
            title: "Create Event",
            path: "/admin/events/new",
            icon: AlarmAddIcon,
            roles: ["admin"]
        },
        {
            title: "Tasks",
            path: '/faculty/tasks/new',
            icon: AddTaskIcon,
            roles: ['faculty']
        },
        {
            title: "Tests",
            path: '/faculty/tests/new',
            icon: PostAddIcon,
            roles: ['faculty']
        },
        {
            title: "Attendance",
            path: '/faculty/attendance/new',
            icon: PlaylistAddIcon,
            roles: ['faculty']
        },
        {
            title: "Marks",
            path: '/faculty/marks/new',
            icon: AddchartIcon,
            roles: ['faculty']
        },
    ],
    user: [
        {
            title: 'Change Password',
            getPath: (user) => `/${user.role}/updatePassword/${user._id}`,
            icon: LockResetIcon,
            roles: ['admin', 'faculty', 'student']
        },
        {
            title: 'Edit School Info',
            getPath: (user) => `/${user.role}/school/edit/${user.schoolID}`,
            icon: EditIcon,
            roles: ['admin']
        },
    ]
}
