import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const PANEL_MAX_HEIGHT = 280;
const GAP = 4;

/**
 * Open/close state plus the fixed position for a panel anchored to a trigger.
 * The panel flips above the trigger when there isn't room below, and closes on
 * outside click, Escape, scroll or resize.
 */
export function useDropdown({ disabled = false, onOpen, onClose } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < PANEL_MAX_HEIGHT && spaceAbove > spaceBelow;
    const available = Math.max(
      (openUpward ? spaceAbove : spaceBelow) - GAP * 2,
      0
    );

    setPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(PANEL_MAX_HEIGHT, available),
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
    });
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
    onOpen?.();
  }, [disabled, updatePosition, onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Measure before paint so the panel never renders at a stale position.
  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = event => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      ) {
        close();
      }
    };
    // Reposition rather than close, so scrolling a page behind the panel
    // doesn't feel like the menu is being yanked away.
    const handleReflow = () => updatePosition();

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('scroll', handleReflow, true);
    window.addEventListener('resize', handleReflow);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('scroll', handleReflow, true);
      window.removeEventListener('resize', handleReflow);
    };
  }, [isOpen, close, updatePosition]);

  return { isOpen, position, triggerRef, panelRef, open, close, toggle };
}
