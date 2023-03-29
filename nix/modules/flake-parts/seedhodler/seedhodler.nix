{
  config,
  lib,
  dream2nix,
  ...
}: {
  imports = [
    dream2nix.modules.drv-parts.mkDerivation
    dream2nix.modules.drv-parts.dream2nix-legacy
  ];

  name = "seedhodler";
  version = (builtins.fromJSON (builtins.readFile ./package.json)).version;

  dream2nix-legacy = {
    subsystem = "nodejs";
    translator = "package-lock";
    builder = "granular-nodejs";
    subsystemInfo = {
      nodejs = "18";
      noDev = false;
    };
  };
}
