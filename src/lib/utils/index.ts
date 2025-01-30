export function removefocus(html_obj: Element | null): null {
    if (html_obj instanceof HTMLElement) {
        html_obj.blur();
        console.log("removed focus");
    }
    return null;
}
