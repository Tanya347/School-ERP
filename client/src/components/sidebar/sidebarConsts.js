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

export const sidebarConsts = {
    information: [
        {
            title: "Students",
            path: "/admin/students",
            icon: GroupIcon,
            user: "admin",
        },
        {
            title: "Faculties",
            path: "/admin/faculties",
            icon: PersonOutlineIcon,
            user: "admin",
        },
        {
            title: "Updates",
            path: "/admin/updates",
            icon: NotificationsIcon,
            user: "admin",
        },
        {
            title: "Updates",
            path: "/faculty/updates",
            icon: NotificationsIcon,
            user: "faculty",
        },
        {
            title: "Updates",
            path: "/student/updates",
            icon: NotificationsIcon,
            user: "student",
        },
        {
            title: "Courses",
            path: "/admin/courses",
            icon: CollectionsBookmarkIcon,
            user: "admin",
        },
        {
            title: "Classes",
            path: "/admin/classes",
            icon: SchoolIcon,
            user: "admin",
        },
        {
            title: 'Calender',
            getPath: (user) => `/${user.role}/calender`,
            icon: CalendarMonthIcon,
            user: 'both'
        },
        {
            title: "Attendance",
            path: "/faculty/attendance",
            icon: CoPresentIcon,
            user: 'faculty'
        },
        {
            title: "Students",
            path: '/faculty/class/students',
            icon: GroupsIcon,
            user: 'faculty'
        },
        {
            title: "Marks",
            path: '/faculty/marks',
            icon: AssessmentIcon,
            user: 'faculty'
        },
        {
            title: "Tasks",
            getPath: (user) => `/${user.role}/tasks`,
            icon: TaskIcon,
            user: 'both'
        },
        {
            title: "Tests",
            getPath: (user) => `/${user.role}/tests`,
            icon: NoteAddIcon,
            user: 'both'
        },
        {
            title: "Admit Card",
            path: "/student/exams",
            icon: PendingActionsIcon,
            user: 'student'
        },
        {
            title: "Marksheet",
            path: "/student/marks",
            icon: CollectionsBookmarkIcon,
            user: 'student'
        },
        {
            title: "Materials",
            getPath: (user) => `/${user.role}/materials`,
            icon: FolderCopyIcon,
            user: 'all'
        },
        {
            title: "Events",
            getPath: (user) => `/${user.role}/events`,
            icon: EmojiEventsIcon,
            user: 'all'
        },
    ],
    create: [
        {
            title: "Create Student",
            path: "/admin/students/new",
            icon: GroupAddIcon,
            user: "admin",
        },
        {
            title: "Create Faculty",
            path: "/admin/faculties/new",
            icon: PersonAddIcon,
            user: "admin",
        },
        {
            title: "Create Update",
            path: "/admin/updates/new",
            icon: NotificationAddIcon,
            user: "admin",
        },
        {
            title: "Create Update",
            path: "/faculty/updates/new",
            icon: NotificationAddIcon,
            user: "faculty",
        },
        {
            title: "Create Course",
            path: "/admin/courses/new",
            icon: BookIcon,
            user: "admin",
        },
        {
            title: "Create Timetable",
            path: "/admin/timetables/new",
            icon: ViewTimelineIcon,
            user: "admin",
        },
        {
            title: "Add Exam Dates",
            path: "/admin/exams/dates",
            icon: PendingActionsIcon,
            user: "admin"
        },
        {
            title: "Add Material",
            path: "/admin/materials/new",
            icon: CreateNewFolderIcon,
            user: "admin"
        },
        {
            title: "Add Material",
            path: "/faculty/materials/new",
            icon: CreateNewFolderIcon,
            user: "faculty"
        },
        {
            title: "Classes",
            path: "/admin/classes/new",
            icon: AddModeratorIcon,
            user: "admin"
        },
        {
            title: "Create Event",
            path: "/admin/events/new",
            icon: AlarmAddIcon,
            user: "admin"
        },
        {
            title: "Tasks",
            path: '/faculty/tasks/new',
            icon: AddTaskIcon,
            user: 'faculty'
        },
        {
            title: "Tests",
            path: '/faculty/tests/new',
            icon: PostAddIcon,
            user: 'faculty'
        },
        {
            title: "Attendance",
            path: '/faculty/attendance/new',
            icon: PlaylistAddIcon,
            user: 'faculty'
        },
        {
            title: "Marks",
            path: '/faculty/marks/new',
            icon: AddchartIcon,
            user: 'faculty'
        },
    ],
    user: [
        {
            title: 'Change Password',
            getPath: (user) => `/${user.role}/updatePassword/${user._id}`,
            icon: LockResetIcon,
            user: 'admin'
        },
        {
            title: 'Edit School Info',
            getPath: (user) => `/${user.role}/school/edit/${user.schoolID}`,
            icon: EditIcon,
            user: 'admin'
        },
    ]
}
