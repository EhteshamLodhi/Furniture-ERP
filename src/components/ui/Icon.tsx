import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Armchair,
  Bell,
  BellRing,
  Boxes,
  Calendar,
  CalendarDays,
  ChartColumn,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Clock,
  CloudOff,
  Download,
  Ellipsis,
  Factory,
  FingerprintPattern,
  Landmark,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Package,
  Plus,
  ReceiptText,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Store,
  TriangleAlert,
  Trash2,
  Truck,
  User,
  UserPlus,
  Users,
  Wallet,
  X,
  type LucideProps,
} from 'lucide-react';

/**
 * Icon registry.
 *
 * Keys keep the Material Symbols names the app was originally written against
 * so icon names stored as data (nav configs, notification types) keep working —
 * but they now resolve to tree-shaken lucide SVGs instead of a render-blocking
 * icon font from a third-party CDN.
 */
const registry = {
  account_balance: Landmark,
  add: Plus,
  add_circle: CirclePlus,
  add_shopping_cart: ShoppingCart,
  arrow_back: ArrowLeft,
  arrow_downward: ArrowDown,
  arrow_upward: ArrowUp,
  assessment: ChartColumn,
  calendar_month: CalendarDays,
  calendar_today: Calendar,
  chair: Armchair,
  check_circle: CircleCheck,
  chevron_right: ChevronRight,
  close: X,
  cloud_off: CloudOff,
  dashboard: LayoutDashboard,
  delete: Trash2,
  download: Download,
  error: CircleAlert,
  expand_more: ChevronDown,
  factory: Factory,
  fingerprint: FingerprintPattern,
  groups: Users,
  install_mobile: Smartphone,
  inventory: Package,
  inventory_2: Boxes,
  local_shipping: Truck,
  lock: Lock,
  logout: LogOut,
  manage_search: Search,
  menu: Menu,
  more_horiz: Ellipsis,
  notifications: Bell,
  notifications_active: BellRing,
  payments: Wallet,
  person: User,
  person_add: UserPlus,
  receipt_long: ReceiptText,
  save: Save,
  schedule: Clock,
  search: Search,
  shield_person: ShieldCheck,
  shopping_bag: ShoppingBag,
  shopping_cart: ShoppingCart,
  storefront: Store,
  store: Store,
  warning: TriangleAlert,
} as const;

export type IconName = keyof typeof registry;

type IconProps = Omit<LucideProps, 'ref' | 'name'> & {
  name: IconName;
  /** Accessible label. Omit for decorative icons, which are hidden from AT. */
  label?: string;
};

/**
 * Sized in `em` so the existing Tailwind text-size classes (`text-sm`,
 * `text-4xl`, `text-[18px]`) keep controlling icon size exactly as they did
 * when these were font glyphs.
 */
export default function Icon({ name, label, className, ...props }: IconProps) {
  const Glyph = registry[name];

  return (
    <Glyph
      width="1em"
      height="1em"
      strokeWidth={2}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={['inline-block shrink-0 align-middle', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
