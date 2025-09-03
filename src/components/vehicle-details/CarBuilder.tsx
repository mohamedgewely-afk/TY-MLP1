import React, { useCallback, useMemo, useState } from "react";
deviceCategory={deviceCategory}
/>
) : (
<DesktopCarBuilder
key={isTablet ? "tablet" : "desktop"}
variant={isTablet ? "tablet" : "desktop"}
vehicle={vehicle}
step={step}
config={config}
setConfig={setConfig}
showConfirmation={showConfirmation}
calculateTotalPrice={calculateTotalPrice}
handlePayment={handlePayment}
goBack={goBack}
goNext={goNext}
onClose={onClose}
onReset={() => setShowResetDialog(true)}
/>
)}
</AnimatePresence>
);


return (
<>
{/* Reset Confirmation Dialog */}
<AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Reset Configuration</AlertDialogTitle>
<AlertDialogDescription>
Are you sure you want to reset your vehicle configuration? This will clear all selections and return to step one.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
<AlertDialogAction onClick={handleReset} disabled={isResetting} className="relative min-h-[44px] min-w-[44px]">
{isResetting ? (
<>
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
Resetting...
</>
) : (
"Reset"
)}
</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>


{/* Main dialog */}
{isMobile ? (
<MobileDialog open={isOpen} onOpenChange={onClose}>
<MobileDialogContent>
<VisuallyHidden>
<DialogTitle>Build Your {vehicle.name}</DialogTitle>
<DialogDescription>
Customize your {vehicle.name} by selecting model year, engine, grade, colors, and accessories.
</DialogDescription>
</VisuallyHidden>
{content}
</MobileDialogContent>
</MobileDialog>
) : (
<Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-background overflow-hidden">
<VisuallyHidden>
<DialogTitle>Build Your {vehicle.name}</DialogTitle>
<DialogDescription>
Customize your {vehicle.name} by selecting model year, engine, grade, colors, and accessories.
</DialogDescription>
</VisuallyHidden>
{content}
</DialogContent>
</Dialog>
)}
</>
);
};


export default CarBuilder;