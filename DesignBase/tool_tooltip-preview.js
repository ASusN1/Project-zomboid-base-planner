const tool_tooltip_box = document.getElementById('tool-tooltip-box');
const tool_tooltip_name_text = document.getElementById('tool-tooltip-name-text');
const tool_tooltip_video_box = document.getElementById('tool-tooltip-video-box');
const tool_tooltip_text_description_for_that_tool = document.getElementById('tool-tooltip-text-description-for-that-tool');

const all_tool_btn_with_previews = document.querySelectorAll('.tool-tooltip-hover-show-tooltip');

const HOVER_DELAY = 500;
let hoverDelayTimer = null;

for (let i = 0; i < all_tool_btn_with_previews.length; i++) {
    const currentToolBtn = all_tool_btn_with_previews[i];

    currentToolBtn.addEventListener("mouseenter", () => {
        hoverDelayTimer = setTimeout(() => {
            const toolName = currentToolBtn.dataset.toolName;

            tool_tooltip_name_text.textContent = toolName;

            tool_tooltip_video_box.innerHTML = "";
            tool_tooltip_text_description_for_that_tool.textContent = "";

            // look for a hidden iframe in the html that belongs to this button
            const matchingVideoSource = document.querySelector('.tool-video-yt-source[data-owner="' + currentToolBtn.id + '"]');

            // only show a video if a matching iframe was actually found
            if (matchingVideoSource) {
                const videoIframe = matchingVideoSource.cloneNode();
                videoIframe.style.display = "";
                videoIframe.allow = "autoplay; encrypted-media";
                tool_tooltip_video_box.appendChild(videoIframe);

                tool_tooltip_text_description_for_that_tool.textContent = "text text text text text texts stuff . add more later";
            }

            const buttonRect = currentToolBtn.getBoundingClientRect();

            tool_tooltip_box.style.left = (buttonRect.left -200)+ "px";
            tool_tooltip_box.style.top = buttonRect.top + "px";

            tool_tooltip_box.style.display = "flex";

        }, HOVER_DELAY);
    });

    currentToolBtn.addEventListener("mouseleave", () => {
        clearTimeout(hoverDelayTimer);
        tool_tooltip_box.style.display = "none";
        tool_tooltip_video_box.innerHTML = "";
    });
}