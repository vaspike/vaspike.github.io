$(function (){
    const settings = {
        autoResize: true,/*enable/disable autoResize*/
        autoResizeMinWidth: null,/*set autoResize min width*/
        autoResizeMaxWidth: null,/*set autoResize max width*/
        autoResizeMinHeight: null,/*set autoResize min height*/
        autoResizeMaxHeight: null,/*set autoResize max height*/
        addMouseControls: true,/*enable/disable mouse controls*/
        addTouchControls: true,/*enable/disable touch controls*/
        hideContextMenu: true,/*enable/disable canvas context menu*/
        starCount: 1000,/*count of active/moving stars*/
        starBgCount: 2222,/*count of inactive/background stars*/
        starBgColor: { r:255, g:255, b:255 },/*background stars color*/
        starBgColorRangeMin: 10,/*background stars color range min of starBgColor*/
        starBgColorRangeMax: 40,/*background stars color range max of starBgColor*/
        starColor: { r:255, g:255, b:255 },/*stars color*/
        starColorRangeMin: 10,/*stars color range min of starBgColor*/
        starColorRangeMax: 100,/*stars color range max of starBgColor*/
        starfieldBackgroundColor: { r:29, g:32, b:33 },/*background color*/
        starDirection: 1,/*stars moving in which direction*/
        starSpeed: 40,/*stars moving speed*/
        starSpeedMax: 200,/*stars moving speed max*/
        starSpeedAnimationDuration: 5,/*time in seconds from starSpeed to starSpeedMax*/
        starFov: 300,/*field of view*/
        starFovMin: 200,/*field of view min*/
        starFovAnimationDuration: 2,/*time in seconds from starFov to starFovMin*/
        starRotationPermission: true,/*enable/disable rotation*/
        starRotationDirection: 1,/*rotation direction*/
        starRotationSpeed: 0.0,/*rotation speed*/
        starRotationSpeedMax: 1.0,/*rotation speed max*/
        starRotationAnimationDuration: 2,/*time in seconds from starRotationSpeed to starRotationSpeedMax*/
        starWarpLineLength: 2.0,/*line length*/
        starWarpTunnelDiameter: 100,/*tunnel diameter*/
        starFollowMouseSensitivity: 0.025,/*mouse follow sensitivity*/
        starFollowMouseXAxis: true,/*enable/disable mouse follow x axis*/
        starFollowMouseYAxis: true/*enable/disable mouse follow y axis*/

    };

    let $background = $(".background-top");
    $background.warpDrive(settings);
})