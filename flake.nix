{
  description = "Development environment for Seedhodler";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
    nixpkgs.url = "nixpkgs/nixos-unstable";
    dream2nix.url = "github:nix-community/dream2nix";
    nix-filter.url = "github:numtide/nix-filter";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "x86_64-linux" # 64-bit Intel/AMD Linux
      ];

      imports = [
        ./nix/modules/flake-parts/all-modules.nix
      ];
    };
}
