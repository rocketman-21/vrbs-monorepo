import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { MenuOption } from "@cobuild/libs/revolution/interfaces";
import { useRevolution } from "app/libs/useRevolution";
import { useMemo } from "react";

export const useMenuOptions = () => {
  const { daoContract, addresses, revolutionId } = useRevolution();

  const menuOptions: MenuOption[] = useMemo(() => {
    const { hiddenMenuItems, customMenuItems, homepageRedirect } =
      getRevolutionConfig(revolutionId);

    let baseOptions: MenuOption[] = [
      { url: homepageRedirect || "", name: "Home" },
      { url: "creations", name: "Art Race" },
      { url: "stories", name: "Stories" },
    ];

    if (daoContract) {
      baseOptions.push({ url: "dao", name: "DAO" });
    }

    baseOptions = baseOptions.filter(option => !hiddenMenuItems?.includes(option.url));

    if (addresses?.auction && homepageRedirect !== "auction") {
      // insert auction after Home if home is present
      const homeIndex = baseOptions.findIndex(option => option.url === homepageRedirect || "");
      if (homeIndex !== -1) {
        baseOptions = [
          ...baseOptions.slice(0, homeIndex + 1),
          { url: "auction", name: "Auction" },
          ...baseOptions.slice(homeIndex + 1),
        ];
      } else {
        baseOptions = [{ url: "auction", name: "Auction" }, ...baseOptions];
      }
    }

    // ToDo: refactor
    if (customMenuItems) {
      //merge custom menu items with base options with same url, preserve order of baseOptions
      baseOptions = baseOptions.map(baseOption => {
        const customOption = customMenuItems.find(
          customOption => customOption.url === baseOption.url,
        );
        return customOption ? customOption : baseOption;
      });

      // add custom menu items that aren't in baseOptions
      const uniqueCustomOptions = customMenuItems.filter(
        customOption => !baseOptions.find(baseOption => baseOption.url === customOption.url),
      );

      baseOptions = [...baseOptions, ...uniqueCustomOptions];
    }

    return baseOptions;
  }, [revolutionId, daoContract, addresses]);

  return menuOptions;
};
