{
  self,
  lib,
  inputs,
  ...
} @ flake: {
  perSystem = {
    config,
    self',
    inputs',
    pkgs,
    system,
    ...
  }: {
    packages.seedhodler = inputs.dream2nix.lib.evalModules {
      modules = [
        ./seedhodler.nix
        {
          dream2nix-legacy.source = self.src;
        }
      ];
      packageSets = {
        nixpkgs = pkgs;
      };
    };
  };
}
