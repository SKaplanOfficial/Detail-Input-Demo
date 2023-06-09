JsOsaDAS1.001.00bplist00�Vscript_
,(() => {
  ObjC.import("AppKit");
  ObjC.import("ApplicationServices");
  ObjC.import("Quartz");
  ObjC.import("CoreGraphics");
  
  const trusted = $.AXIsProcessTrustedWithOptions;
  const _NSApp = $.NSApplication.sharedApplication;
  
  const screenFrame = $.NSScreen.mainScreen.frame
  const screenWidth = screenFrame.size.width
  const screenHeight = screenFrame.size.height
  
  if (!$["NSApplicationDelegate"]) {
    ObjC.registerSubclass({
      name: "NSApplicationDelegate",
      superclass: "NSObject",
      protocols: ["NSApplicationDelegate"],
      methods: {
        "applicationDidFinishLaunching:": {
          types: ["void", ["id"]],
          implementation: function (notification) {
            let typedValue = "";
			const startDate = $.NSDate.alloc.inite
			const maxDuration = 100;
			
            const monitor =
              $.NSEvent.addGlobalMonitorForEventsMatchingMaskHandler(
                $.NSEventMaskLeftMouseDown,
                (event) => {
				
				  const windowNum = event.windowNumber
				  const windowList = ObjC.castRefToObject($.CGWindowListCopyWindowInfo($.kCGWindowListOptionAll, $.kCGNullWindowID))
				  const raycastWindow = windowList.js.filter((win) => win.js["kCGWindowNumber"].js == windowNum)?.[0]
				  
				  // Coordinates and dimensions of the Raycast window
				  const vals = Object.values(raycastWindow.valueForKey("kCGWindowBounds").js)
				  const w = vals[0].js;
				  const h = vals[1].js;
				  const y = screenHeight - vals[2].js;
				  const x = vals[3].js;
					
				  // Mouse point converted to window coords
                  const loc = event.locationInWindow
				  const mx_window = loc.x - x;
				  const my_window = loc.y - y + h;
				  
				  // Coordinates and dimensions of the Detail content subview
				  const dw = w;
				  const dh = 375;
				  const dy = 40;
				  const dx = 0;
				  
				  // Mouse pont converted to Detail content subview coords
				  // Origin is now upper left corner (more intuitive, imo)
				  const mx_detail = mx_window
				  const my_detail = dy + dh - my_window
				  
				  const contentIndent = 15;
				  const contentStartY = 15;
				  const lineHeight = 20;
				  const lineSpacing = 20;
				  
				  // Log the adjusted coordinates (Send to stderr for analysis by Raycast extension)
				  console.log(`${Math.round(mx_detail)}, ${Math.round(my_detail)}`);
                }
              );
          },
        },
      },
    });
  }

  const delegate = $.NSApplicationDelegate.alloc.init;
  _NSApp.delegate = delegate;

  if ($.AXIsProcessTrusted()) {
    _NSApp.run;
  }
})();                              
Bjscr  ��ޭ