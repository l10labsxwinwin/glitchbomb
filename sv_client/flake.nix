{
  description = "Development environment for sv_client";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            nodePackages.typescript-language-server
            nodePackages.svelte-language-server
            nodePackages.prettier
            nodePackages.eslint
          ];

          shellHook = ''
            echo "sv_client dev env"
            echo "node version: $(node --version)"
            echo "npm version: $(npm --version)"
            echo "typescript-language-server: $(typescript-language-server --version)"
            echo "svelteserver: available"
            echo "prettier: $(prettier --version)"
          '';
        };
      });
}
