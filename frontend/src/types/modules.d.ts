declare module '@hookform/resolvers/zod' {
  export const zodResolver: any;
}

declare module 'sonner' {
  export const Toaster: any;
  export type ToasterProps = {
    position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
    richColors?: boolean;
    duration?: number;
    theme?: 'light' | 'dark';
    // ... другие свойства, когда будут использоваться.
  };
  export const toast: any;
}

declare module '@heroui/react' {
  export const HeroUIProvider: any;
  export const Input: any;
  export const Button: any;
  export const Spinner: any;
  export const Card: any;
  export const Tooltip: any;
  export const Popover: any;
  export const PopoverTrigger: any;
  export const PopoverContent: any;
  export const Modal: any;
  export const ModalContent: any;
  export const ModalHeader: any;
  export const ModalBody: any;
  export const ModalFooter: any;
  export const useDisclosure: any;
  export const Tabs: any;
  export const Tab: any;
  export const Checkbox: any;
}

declare module '@heroui/theme' {
  export const heroui: any;
}

declare module 'next/navigation' {
  export const useRouter: () => {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  export const usePathname: () => string;
  export const useSearchParams: () => {
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string) => boolean;
  };
}