import type { Action } from 'svelte/action';

type DragParams = {
    orientation: 'vertical' | 'horizontal';
};

export const onDrag: Action<HTMLElement, DragParams> = (node, params) => {
    let dragStart: number | null = null;
    const attr = params?.orientation === 'vertical' ? 'screenX' : 'screenY';

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        dragStart = e[attr];
        node.dispatchEvent(new CustomEvent('dragStart'));
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragStart === null) return;
        const delta = e[attr] - dragStart;
        node.dispatchEvent(new CustomEvent<number>('drag', { detail: delta }));
    };

    const handleMouseUp = () => {
        dragStart = null;
        node.dispatchEvent(new CustomEvent('dragEnd'));
    };

    node.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };
};