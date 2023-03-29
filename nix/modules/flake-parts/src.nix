{
  self,
  lib,
  inputs,
  ...
}: let
  nix-filter = inputs.nix-filter.lib;
in {
  # options.src = lib.mkOption { type = lib.types.raw; };
  flake.src = nix-filter {
    root = "${self}";
    # include = [];
    exclude = [
      # exclude the ./nix directory
      "nix"
      # exclude the flake.lock file
      "flake.lock"
      # exclude all .nix files at all locations
      (nix-filter.matchExt ".nix")
    ];
  };
}
