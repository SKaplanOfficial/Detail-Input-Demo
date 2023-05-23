(() => {
  ObjC.import("AppKit");
  ObjC.import("Foundation");
  ObjC.import("ApplicationServices");
  ObjC.import("Cocoa");

  const app = Application.currentApplication();
  app.includeStandardAdditions = true;

  const mutedBefore = app.getVolumeSettings().outputMuted;
  app.setVolume(null, { outputMuted: true });

  const trusted = $.AXIsProcessTrustedWithOptions;
  const _NSApp = $.NSApplication.sharedApplication;

  if (!$["NSApplicationDelegate"]) {
    ObjC.registerSubclass({
      name: "NSApplicationDelegate",
      superclass: "NSObject",
      protocols: ["NSApplicationDelegate"],
      properties: {
        locations: "id",
      },
      methods: {
        "applicationDidFinishLaunching:": {
          types: ["void", ["id"]],
          implementation: function (notification) {
            let typedValue = "";
            const startDate = $.NSDate.alloc.init;
            const maxDuration = 100;

            const monitor = $.NSEvent.addGlobalMonitorForEventsMatchingMaskHandler($.NSEventMaskKeyDown, (event) => {
              const newChar = event.characters.js;
              const keyCode = event.keyCode;
              if (
                (newChar == "\r" && typedValue.endsWith("\r")) ||
                (typedValue == "" && startDate.timeIntervalSinceNow < -maxDuration)
              ) {
                if (!mutedBefore) {
                  app.setVolume(null, { outputMuted: false });
                }
                $.NSEvent.removeMonitor(monitor);
                $.NSApp.terminate($.NSApp);
              }

              if (keyCode == 123 || keyCode == 117) {
                typedValue = typedValue.substring(0, typedValue.length - 1);
              } else {
                typedValue += newChar;
              }
              console.log(typedValue.replaceAll("\r", "\n\n") + "|");
            });
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
})();
